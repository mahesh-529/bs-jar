import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3/index';

@Component({
  selector: 'app-line-drag',
  templateUrl: './line-drag.component.html',
  styleUrls: ['./line-drag.component.css']
})
export class LineDragComponent implements OnInit {

     ngOnInit() {
        this.drawChart();
     }

     drawChart() {
         let svg = d3.select('svg'),
            margin = {top: 20, right: 20, bottom: 110, left: 40},
            width = +svg.attr('width') - margin.left - margin.right,
            height = +svg.attr('height') - margin.top - margin.bottom;

        let points = d3.range(1, 5).map(function(i) {
            return [i * width / 5, 50 + Math.random() * (height - 100)];
        });
        let drag = d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragging)
                    .on('end', dragended);

        let dragged = null,
            selected = points[0];

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
            // .on('mousedown', mousedown);

        svg.append('path')
            .datum(points)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .call(redraw);

        // d3.select(window)
        //     .on('mousemove', mousemove)
        //     .on('mouseup', mouseup)
        //     .on('keydown', keydown);

        // d3.select('#interpolate')
        //     .on('change', change)
        //     .selectAll('option')
        //         .data([
        //         'linear',
        //         'step-before',
        //         'step-after',
        //         'basis',
        //         'basis-open',
        //         'basis-closed',
        //         'cardinal',
        //         'cardinal-open',
        //         'cardinal-closed',
        //         'monotone'
        //         ])
        //     .enter().append('option')
        //         .attr('value', function(d) { return d; })
        //         .text(function(d) { return d; });

        // svg.node().focus();

        function redraw() {
            svg.select('path').attr('d', line);

            let circle = svg.selectAll('circle').data(points);
            circle.enter().append('circle')
                    .attr('r', 1e-6)
                    .on('mousedown', function(d) { selected = dragged = d; redraw(); })
                    .attr('cx', function(d) { return d[0]; })
                    .attr('cy', function(d) { return d[1]; })
                    .attr('r', 10)
                    .attr('fill', 'steelblue');

            d3.selectAll('circle').call(drag);
            circle.classed('selected', function(d) { return d === selected; });

            circle.exit().remove();

            if (d3.event) {
                d3.event.preventDefault();
                d3.event.stopPropagation();
            }
        }

        function dragstarted(d) {
            d3.select(this).raise().classed('active', true);
        }

        function dragging(d) {
            console.log(d3.event.x);
            d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
        }

        function dragended(d) {
            d3.select(this).classed('active', false);
        }
        // function change() {
        //     line.interpolate(this.value);
        //     redraw();
        // }

        // function mousedown() {
        //     points.push(selected = dragged = d3.mouse(svg.node());
        //     redraw();
        // }

        // function mousemove() {
        //     if (!dragged) { return; };
        //     let m = d3.mouse();
        //     dragged[0] = Math.max(0, Math.min(width, m[0]));
        //     dragged[1] = Math.max(0, Math.min(height, m[1]));
        //     redraw();
        // }

        // function mouseup() {
        //     if (!dragged) { return; };
        //     mousemove();
        //     dragged = null;
        // }

        // function keydown() {
        //     if (!selected) { return; };
        //     switch (d3.event.keyCode) {
        //         case 8: // backspace
        //         case 46: { // delete
        //         let i = points.indexOf(selected);
        //         points.splice(i, 1);
        //         selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
        //         redraw();
        //         break;
        //         }
        //     }
        // }
    }
}
