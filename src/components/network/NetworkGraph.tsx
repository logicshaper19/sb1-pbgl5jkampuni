'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Director, Shareholder } from '@/types';

interface NetworkGraphProps {
  companyId: string;
  companyName: string;
  directors: Director[];
  shareholders: Shareholder[];
}

interface Node {
  id: string;
  name: string;
  type: 'company' | 'director' | 'shareholder' | 'related';
  value?: number;
}

interface Link {
  source: string;
  target: string;
  type: 'director' | 'shareholder' | 'related';
  value?: number;
}

export function NetworkGraph({ companyId, companyName, directors, shareholders }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 1000;
  const height = 400;
  const padding = 100;
  const circleRadius = 6;
  const circleSpacing = 14;

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG first
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    // Create a map using name as the key to handle duplicates
    const peopleMap = new Map<string, {
      id: string,
      name: string,
      roles: Set<'director' | 'shareholder'>,
      shareholding?: number
    }>();

    // Process directors first
    directors.forEach(d => {
      peopleMap.set(d.name, {  // Using name as key instead of ID
        id: d.id,
        name: d.name,
        roles: new Set(['director'])
      });
    });

    // Process shareholders and merge with existing directors if needed
    shareholders.forEach(s => {
      if (peopleMap.has(s.name)) {
        // Person already exists (probably as director), add shareholder role
        const person = peopleMap.get(s.name)!;
        person.roles.add('shareholder');
        person.shareholding = s.percentage;
      } else {
        // New person
        peopleMap.set(s.name, {
          id: s.id,
          name: s.name,
          roles: new Set(['shareholder']),
          shareholding: s.percentage
        });
      }
    });

    // Create nodes and links
    const nodes = [
      { id: companyId, name: companyName, type: 'company' },
      ...Array.from(peopleMap.values()).map(person => ({
        id: person.id,
        name: person.name,
        type: 'person',
        roles: Array.from(person.roles),
        shareholding: person.shareholding
      }))
    ];

    const links = Array.from(peopleMap.values()).map(person => ({
      source: person.id,
      target: companyId,
      type: 'connection'
    }));

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.6);

    // Create node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add name labels
    node.append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', '12px')
      .text(d => d.name);

    // Add role indicators
    node.each(function(d: any) {
      if (d.type === 'person') {
        const roleGroup = d3.select(this);
        const roles = d.roles.sort(); // Sort to ensure consistent order
        
        // Add circles for roles
        roles.forEach((role: string, index: number) => {
          roleGroup.append('circle')
            .attr('r', circleRadius)
            .attr('cx', (index - (roles.length - 1) / 2) * circleSpacing)
            .attr('cy', 5)
            .attr('fill', role === 'director' ? '#9333ea' : '#2563eb');
        });

        // Add shareholding percentage if available
        if (d.shareholding) {
          roleGroup.append('text')
            .attr('dy', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', '#64748b')
            .attr('font-size', '10px')
            .text(`${d.shareholding}%`);
        }
      } else {
        // Company node
        d3.select(this).append('circle')
          .attr('r', circleRadius * 1.5)
          .attr('fill', '#ef4444');
      }
    });

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${padding}, ${padding})`);

    const legendData = [
      { type: 'company', color: '#ef4444', label: 'Company' },
      { type: 'director', color: '#9333ea', label: 'Director' },
      { type: 'shareholder', color: '#2563eb', label: 'Shareholder' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('circle')
      .attr('r', circleRadius)
      .attr('fill', d => d.color);

    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 4)
      .text(d => d.label)
      .attr('font-size', '12px')
      .attr('fill', '#4b5563');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [companyId, companyName, directors, shareholders]);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p-4 mb-8">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}