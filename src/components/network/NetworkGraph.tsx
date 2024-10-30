'use client';

import { useEffect, useRef } from 'react';
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
  type: 'company' | 'director' | 'shareholder';
  value?: number;
}

interface Link {
  source: string;
  target: string;
  type: 'director' | 'shareholder';
  value?: number;
}

export function NetworkGraph({ companyId, companyName, directors, shareholders }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data
    const nodes: Node[] = [
      { id: companyId, name: companyName, type: 'company' },
      ...directors.map(d => ({
        id: `director-${d.id}`,
        name: d.name,
        type: 'director' as const
      })),
      ...shareholders.map(s => ({
        id: `shareholder-${s.id}`,
        name: s.name,
        type: 'shareholder' as const,
        value: s.percentage
      }))
    ];

    const links: Link[] = [
      ...directors.map(d => ({
        source: `director-${d.id}`,
        target: companyId,
        type: 'director' as const
      })),
      ...shareholders.map(s => ({
        source: `shareholder-${s.id}`,
        target: companyId,
        type: 'shareholder' as const,
        value: s.percentage
      }))
    ];

    // Set up dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.type === 'director' ? '#9333ea' : '#2563eb')
      .attr('stroke-width', d => d.value ? Math.sqrt(d.value) : 1)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.type === 'company' ? 20 : 10)
      .attr('fill', d => {
        switch (d.type) {
          case 'company': return '#ef4444';
          case 'director': return '#9333ea';
          case 'shareholder': return '#2563eb';
          default: return '#gray';
        }
      });

    // Add labels to nodes
    node.append('text')
      .attr('dx', 15)
      .attr('dy', 5)
      .text(d => d.name)
      .attr('fill', '#1f2937')
      .attr('font-size', '12px');

    // Add titles for hover
    node.append('title')
      .text(d => {
        if (d.type === 'shareholder' && d.value) {
          return `${d.name} (${d.value}%)`;
        }
        return d.name;
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    // Drag functions
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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [companyId, companyName, directors, shareholders]);

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}