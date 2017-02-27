import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3/index';

@Component({
  selector: 'app-circle-drag',
  templateUrl: './circle-drag.component.html',
  styleUrls: ['./circle-drag.component.css']
})
export class CircleDragComponent implements OnInit {

     ngOnInit() {
        this.dragCircles();
     }

     dragCircles() {

        let svg = d3.select('svg'),
            width = +svg.attr('width'),
            height = +svg.attr('height');

        let points = d3.range(1, 10).map(function(i) {
            return [i * width / 10, 50 + Math.random() * (height - 100)];
        });

        let line = d3.line();

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5);

        svg.append('path')
            .datum(points)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', line);

      svg.selectAll('circle')
          .data(points)
          .enter()
          .append('circle')
          .style('fill', 'steelblue')
          .attr('r', 10)
          .attr('cx', function(d) { return d[0]; })
          .attr('cy', function(d) { return d[1]; });

      svg.selectAll('circle')
        .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        function dragstarted(d) {
          d3.select(this).raise().classed('active', true);
        }

        function dragged(d) {
          d3.select(this).attr('cx', d[0] = d3.event.x).attr('cy', d[1] = d3.event.y);
          svg.select('path').attr('d', line);
        }

        function dragended(d) {
          d3.select(this).classed('active', false);
        }
     }
}
