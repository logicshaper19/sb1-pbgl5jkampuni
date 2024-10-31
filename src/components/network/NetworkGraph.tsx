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

  const width = 1000;
  const height = 400;

  // Add padding to keep nodes away from edges
  const padding = 100;

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data with deduplication
    const uniqueNodes = new Map<string, Node>();
    const links: Link[] = [];

    // Add company node
    uniqueNodes.set(companyId, {
      id: companyId,
      name: companyName,
      type: 'company'
    });

    // Add directors and their links
    directors.forEach(d => {
      const id = d.id;
      uniqueNodes.set(id, {
        id,
        name: d.name,
        type: 'director'
      });
      links.push({
        source: id,
        target: companyId,
        type: 'director'
      });
    });

    // Add shareholders and their links
    shareholders.forEach(s => {
      const id = s.id;
      uniqueNodes.set(id, {
        id,
        name: s.name,
        type: 'shareholder',
        value: s.percentage
      });
      links.push({
        source: id,
        target: companyId,
        type: 'shareholder',
        value: s.percentage
      });
    });

    const nodes = Array.from(uniqueNodes.values());

    // Modify simulation forces to prevent overlap
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(200))
      .force('charge', d3.forceManyBody()
        .strength(-2000))
      .force('collide', d3.forceCollide()
        .radius(d => d.type === 'company' ? 100 : 80)
        .strength(1))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .on('tick', () => {
        // Constrain nodes within boundaries
        nodes.forEach(node => {
          node.x = Math.max(padding, Math.min(width - padding, node.x));
          node.y = Math.max(padding, Math.min(height - padding, node.y));
        });

        // Update link positions
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        // Update node positions
        node
          .attr('transform', d => `translate(${d.x},${d.y})`);
      });

    // Add additional separation force for nodes with same person
    simulation.force('collision-resolution', d3.forceRadial(function(d) {
      // Push nodes with same name further apart
      return d.name === companyName ? 0 : 200;
    }, width / 2, height / 2).strength(0.5));

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add a background rect to make the full area clickable
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    // Create container for graph
    const graphContainer = svg.append('g');

    // Add links
    const link = graphContainer.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.type === 'director' ? '#9333ea' : '#2563eb')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Add nodes
    const node = graphContainer.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles for nodes
    node.append('circle')
      .attr('r', d => d.type === 'company' ? 30 : 20)
      .attr('fill', d => {
        switch (d.type) {
          case 'company': return '#ef4444';
          case 'director': return '#9333ea';
          case 'shareholder': return '#2563eb';
          default: return '#gray';
        }
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .attr('dx', d => d.type === 'company' ? 40 : 25)
      .attr('dy', 5)
      .text(d => d.name)
      .attr('fill', '#1f2937')
      .attr('font-size', '14px')
      .attr('font-weight', d => d.type === 'company' ? 'bold' : 'normal');

    // Add legend in a fixed position
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${padding / 2}, ${padding / 2})`);

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
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    // Add colored circles to legend
    legendItems.append('circle')
      .attr('r', 6)
      .attr('fill', d => d.color);

    // Add text labels to legend
    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .text(d => d.label)
      .attr('font-size', '14px')
      .attr('fill', '#4b5563');

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = Math.max(padding, Math.min(width - padding, event.x));
      event.subject.fy = Math.max(padding, Math.min(height - padding, event.y));
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