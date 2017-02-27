import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3/index';

@Component({
  selector: 'app-line-chart-zoom',
  templateUrl: './line-chart-zoom.component.html',
  styleUrls: ['./line-chart-zoom.component.css']
})
export class LineChartZoomComponent implements OnInit {

     ngOnInit() {
        this.drawChart();
     }
     drawChart() {
        let svg = d3.select('svg'),
            margin = {top: 20, right: 20, bottom: 110, left: 40},
            margin2 = {top: 430, right: 20, bottom: 30, left: 40},
            width = +svg.attr('width') - margin.left - margin.right,
            height = +svg.attr('height') - margin.top - margin.bottom,
            height2 = +svg.attr('height') - margin2.top - margin2.bottom;

        let parseDate = d3.timeParse('%b %Y');


        let points = d3.range(1, 10).map(function(i) {
            return [i * width / 10, 50 + Math.random() * (height - 100)];
        });

        // let points = [[10, 20], [20, 30], [30, 40], [40, 50], [50, 60], [60, 70], [70, 80]];

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on('brush end', brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', zoomed);

        let line1 = d3.line()
            .x(function(d: any) { return x(d[0]); })
            .y(function(d: any) { return y(d[1]); });

        let line2 = d3.line()
            .x(function(d: any) { return x2(d[0]); })
            .y(function(d: any) { return y2(d[1]); });

        let drag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);

        svg.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width)
            .attr('height', height);

        svg.append('rect')
            .attr('class', 'zoom')
            .attr('cursor', 'move')
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .attr('width', width)
            .attr('height', height)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        let focus = svg.append('g')
            .attr('class', 'focus')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let context = svg.append('g')
            .attr('class', 'context')
            .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

        // d3.csv('assets/data.csv', type, function(error, data) {
        //     if (error) {
        //         throw error;
        //     }
            x.domain([0, d3.max(points, function(d) { return d[0]; })]);
            y.domain([0, d3.max(points, function(d) { return d[1]; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            focus.append('path')
                .datum(points)
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('clip-path', 'url(#clip)')
                .attr('d', line1);

            focus.selectAll('circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('r', 10.0)
                .attr('cx', function(d: any) { return Math.max(0, Math.min(width, x(d[0])));  })
                .attr('cy', function(d: any) { return Math.max(0, Math.min(height, y(d[1]))); })
                .style('cursor', 'pointer')
                .style('fill', 'steelblue');

            focus.selectAll('circle')
                    .call(drag);

            focus.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            focus.append('g')
                .attr('class', 'axis axis--y')
                .call(yAxis);

            context.append('path')
                .datum(points)
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('clip-path', 'url(#clip)')
                .attr('d', line2);

            // context.selectAll('circle')
            //     .data(points)
            //     .enter().append('circle')
            //     .attr('r', 1.0)
            //     .attr('cx', function(d: any) { return x2(d[0]); })
            //     .attr('cy', function(d: any) { return y2(d[1]); })
            //     .style('stroke', 'steelblue')
            //     .style('stroke-width', '2px');

            context.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + height2 + ')')
                .call(xAxis2);

            context.append('g')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, x.range());
        // });

        function dragstarted(d) {
            d3.select(this).raise().classed('active', true);
        }

        function dragged(d) {
            d3.select(this)
                .attr('cx', function() { d[0] = x(d3.event.x); return x(d[0]); })
                .attr('cy', function() { d[1] = y(d3.event.y); return y(d[1]); });
            //     .attr('cx', function() { d[0] = d3.event.x; return d[0]; })
            //     .attr('cy', function() { d[1] = d3.event.y; return d[1]; });
        //   d3.select(this)
        //     .attr('cx', d[0] = d3.event.x)
        //     .attr('cy', d[1] = d3.event.y);
            focus.select('path').attr('d', line1);
        }

        function dragended(d) {
            d3.select(this).classed('active', false);
        }

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
                return; // ignore brush-by-zoom
            }
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select('.line').attr('d', line1);
            focus.select('.axis--x').call(xAxis);
            focus.selectAll('circle')
                    .attr('cx', function(d: any){ return x(d[0]); })
                    .attr('cy', function(d: any){ return y(d[1]); });
            focus.selectAll('circle')
                    .call(drag);
            svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
                return; // ignore zoom-by-brush
            }
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select('.line').attr('d', line1);
            focus.select('.axis--x').call(xAxis);
            focus.selectAll('circle')
                    .attr('cx', function(d: any){ return x(d[0]); })
                    .attr('cy', function(d: any){ return y(d[1]); });
            focus.selectAll('circle')
                    .call(drag);
            context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
        }

        function type(d) {
            d.date = parseDate(d.date);
            d.price = +d.price;
            return d;
        }
    }
}
