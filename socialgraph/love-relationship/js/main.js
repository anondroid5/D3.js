//D3.js force layout
/**
 * Set arrow
 */
function _setArrow(svg)
{
    svg.append('defs').selectAll('marker')
       .data(['arrow']).enter()
       .append('marker')
       .attr('id', function(d) { return d; })
       .attr('viewBox', '0 -5 10 10')
       .attr('refX', 25)
       .attr('refY', 0)
       .attr('markerWidth', 10)
       .attr('markerHeight', 10)
       .attr('orient', 'auto')
       .append('path')
       .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5')
       .style('stroke', '#4679BD')
       .style('opacity', '0.6');
};


/**
 * Initialize SVG Display
 */
function init(svg_id, width, height, data_path)
{
    // 色は既定値
    var color = d3.scale.category20();

    var force = d3.layout.force()
                  .charge(-500)      // node同士の力基準
                  .linkDistance(100)  // node同士の距離基準
                  .size([width, height]);

    var svg = d3.select('#' + svg_id).append('svg')
                .attr('width', width)
                .attr('height', height);

    _setArrow(svg);

    d3.json(data_path, function(error, graph) {

        // JSON Read Error
        if (graph == null) {
            alert(error);
            return;
        }

        force.nodes(graph.nodes)
             .links(graph.links);

        // Tick start
        force.start();

        var link = svg.selectAll('.link')
                      .data(graph.links).enter()
                      .append('line')
                      .attr('class', 'link')
                      .style('stroke-width', 1)
                      .style('marker-end', 'url(#arrow)');

        var node = svg.selectAll('.node')
                      .data(graph.nodes).enter()
                      .append('g')
                      .attr('class', 'node')
                      .call(force.drag);

        var circle = node.append('circle')
                         .attr('r', 5)
                         .style('fill', function(d) { return color(d.group); });

        var text = node.append('text')
                       .attr('dx', 10)
                       .attr('dy', '.35em')
                       .text(function(d) { return d.name; })
                       .style('stroke', 'gray');

        force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            circle.attr('cx', function(d) { return d.x; })
                  .attr('cy', function(d) { return d.y; });

            text.attr('x', function(d) { return d.x; })
                .attr('y', function(d) { return d.y; });
        });
    });
}

/*Main*/
var svg_id    = 'graph';
var element   = document.getElementById(svg_id);
var data_path = './json/LoveRelationship.json';

init(svg_id, element.clientWidth, element.clientHeight, data_path);
