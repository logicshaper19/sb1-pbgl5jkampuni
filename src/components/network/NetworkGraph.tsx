// Previous imports remain the same...

interface NetworkGraphProps {
  companyId: string;
  companyName: string;
  directors: Person[];
  shareholders: Person[];
}

type LayoutType = 'force' | 'radial' | 'circular';

export const NetworkGraph = ({ companyId, companyName, directors, shareholders }: NetworkGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [layout, setLayout] = useState<LayoutType>('force');
  const [groupByType, setGroupByType] = useState(false);

  // ... Previous useEffect for data preparation remains the same ...

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);
    const g = svg.append('g');

    const filteredNodes = nodes.map(node => ({
      ...node,
      hidden: searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())
    }));

    let simulation: d3.Simulation<NetworkNode, NetworkLink>;

    switch (layout) {
      case 'radial':
        simulation = d3.forceSimulation<NetworkNode>(filteredNodes)
          .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(-500))
          .force('r', d3.forceRadial(height / 3, width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(d => (d.value || 20) + 10));
        break;

      case 'circular':
        const radius = Math.min(width, height) / 3;
        const angleStep = (2 * Math.PI) / filteredNodes.length;
        filteredNodes.forEach((node, i) => {
          node.x = width / 2 + radius * Math.cos(i * angleStep);
          node.y = height / 2 + radius * Math.sin(i * angleStep);
          node.fx = node.x;
          node.fy = node.y;
        });
        simulation = d3.forceSimulation<NetworkNode>(filteredNodes)
          .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id(d => d.id));
        break;

      default: // force
        simulation = d3.forceSimulation<NetworkNode>(filteredNodes)
          .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(d => (d.value || 20) + 5));

        if (groupByType) {
          simulation.force('x', d3.forceX<NetworkNode>().x(d => {
            switch (d.type) {
              case 'director': return width * 0.25;
              case 'company': return width * 0.5;
              case 'shareholder': return width * 0.75;
              default: return width * 0.5;
            }
          }).strength(0.5));
        }
    }

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('opacity', d => d.hidden ? 0.2 : 1)
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.value)
      .attr('fill', d => {
        switch (d.type) {
          case 'company': return '#3b82f6';
          case 'director': return '#10b981';
          case 'shareholder': return '#f59e0b';
          default: return '#999';
        }
      });

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', d => d.value + 5)
      .attr('y', 5)
      .attr('font-size', '12px')
      .attr('fill', d => d.hidden ? '#999' : '#000');

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, searchTerm, layout, groupByType]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Network Visualization</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nodes..."
              className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as LayoutType)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="force">Force Layout</option>
            <option value="radial">Radial Layout</option>
            <option value="circular">Circular Layout</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={groupByType}
              onChange={(e) => setGroupByType(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Group by Type</span>
          </label>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (!svgRef.current) return;
                d3.select(svgRef.current)
                  .transition()
                  .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 0.75);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => {
                if (!svgRef.current) return;
                d3.select(svgRef.current)
                  .transition()
                  .call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.5);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <svg ref={svgRef} className="w-full h-[600px]"></svg>
      </div>

      <div className="mt-4 flex gap-6 justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600">Company</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">Directors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600">Shareholders</span>
        </div>
      </div>
    </div>
  );
};