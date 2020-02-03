import { Component, ElementRef, Input, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-pie-chart',
    encapsulation: ViewEncapsulation.ShadowDom,
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
    @ViewChild('piechart', { static: false })
    private chartContainer: ElementRef;

    constructor() { }

    @Input() statsData;
    data;
    percent;

    ngAfterViewInit() {
        if (!!this.statsData) {
            this.prepareData();
            this.createPieChart();
        }
    }

    onResize() {
        if (!!this.statsData) {
            this.createPieChart();
        }
    }

    ngOnChanges() {
        if (this.chartContainer) {
            this.prepareData();
            this.createPieChart();
        }
    }

    calcPercent(percent) {
        return [percent, 100 - percent];
    }

    prepareData() {
        let data = {...this.statsData}["sectionBpms"];
        let highestBpm = d3.max(data, (d) => d.bpm);
        let targetBPM = this.statsData.targetBPM; 
        let percent = (highestBpm / targetBPM) * 100;
        if (percent > 100) {
            percent = 100;
        }
        this.percent = percent;
        this.data = {
            lower: this.calcPercent(0),
            upper: this.calcPercent(percent),
        };
    }

    createPieChart() {
        const element = this.chartContainer.nativeElement;
        d3.select(element).select("#pie-chart").remove();

        // var margin = { top: 10, right: 60, bottom: 30, left: 90 };

        var svg = d3.select(element)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        var bounds = svg.node().getBoundingClientRect();
        var width = bounds.width;
        var height = bounds.height;

        var radius = Math.min(width, height) / 2;
        var format = d3.format(".0%");
        var pie = d3.pie().sort(null);

        svg
            .attr('id', "pie-chart")
            .append("g");

        var arc = d3.arc()
            .innerRadius(radius - 40)
            .outerRadius(radius - 20);

       var path = svg
            .selectAll('chart_data')
            .data(pie(this.data.lower))
            .enter()
            .append('path')
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .attr("class", (d, i) => "color" + i)
            .attr('d', arc)
            .each(function (d) {
                this._current = d;
            });

        var text = svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        var progress = 0;

        var timeout = setTimeout(() => {
            clearTimeout(timeout);
            path = path.data(pie(this.data.upper));
            var that = this;
            path.transition().duration(1500).attrTween("d", function (a) {
                var i = d3.interpolate(this._current, a);
                var i2 = d3.interpolate(progress, that.percent)
                this._current = i(0);
                return function (t) {
                    text.text(format(i2(t) / 100));
                    return arc(i(t));
                };
            });
        }, 200);
    }
}   