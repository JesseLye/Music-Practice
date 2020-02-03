import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-chart',
    // encapsulation: ViewEncapsulation.None,
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit, OnChanges {
    @ViewChild('linechart', { static: false })
    private chartContainer: ElementRef;

    @Input() statsData;
    data;
    ticks: number;

    constructor() { }

    ngAfterViewInit() {
        if (!!this.statsData) {
            this.prepareData();
            this.checkWindowWidth();
            this.createLineChart();
        }
    }

    onResize() {
        if (!!this.statsData) {
            this.checkWindowWidth();
            this.createLineChart();
        }   
    }

    checkWindowWidth() {
        var tickSize = this.determineTickSize();
        if (window.innerWidth <= 1000) {
            this.ticks = Math.round(tickSize / 4);
        } else {
            this.ticks = tickSize;
        }
    }

    determineTickSize() {
        if (this.data.length > 14) {
            return 14;
        } else {
            return 7;
        }
    }


    ngOnChanges() {
        if (this.chartContainer) {
            this.prepareData();
            this.createLineChart();
        }
    }

    datesAreOnSameDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    averageBpm(data) {
        let averagedData = [];
        let startingPosition = 0;
        let nextPosition = 1;
        let index = 0;
        while (startingPosition < data.length) {
            averagedData[index] = { date: data[startingPosition].date, bpm: data[startingPosition].bpm };
            let bpmArray = [];
            bpmArray.push(data[startingPosition].bpm);
            while (nextPosition < data.length) {
                var compareDates = this.datesAreOnSameDay(new Date(data[startingPosition].date), new Date(data[nextPosition].date));
                if (compareDates) {
                    bpmArray.push(data[nextPosition].bpm);
                    nextPosition++;
                } else {
                    break;
                }
            }
            var totalBpm = bpmArray.reduce((total, num) => total + num);
            averagedData[index]["bpm"] = totalBpm / bpmArray.length;
            index++;
            startingPosition = nextPosition;
            nextPosition = nextPosition + 1;
        }
        return averagedData;
    }

    prepareData() {
        let data = this.statsData["sectionBpms"].map(d => { return { bpm: d.bpm, date: new Date(d.createdAt) } });
        this.data = this.averageBpm(data);
    }

    transition(path) {
        let tweenDash = function () {
            var l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function (t) { return i(t); };
        }
        path.transition()
            .duration(3000)
            .attrTween("stroke-dasharray", tweenDash);
    }

    createLineChart() {
        const element = this.chartContainer.nativeElement;
        d3.select(element).select("#line-chart").remove();

        var margin = { top: 10, right: 60, bottom: 30, left: 60 };

        const svg = d3.select(element).append('svg')
            .attr('id', "line-chart")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var bounds = d3.select(element).select("svg").node().getBoundingClientRect(),
            width = bounds.width - margin.left - margin.right,
            height = bounds.height - margin.top - margin.bottom;

        let ticks = this.ticks;
        if (this.data.length < this.ticks) {
            ticks = this.data.length - 1;
        }

        var x = d3.scaleTime()
            .domain(d3.extent(this.data, function (d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(ticks).tickFormat(d3.timeFormat("%a %d")));

        var y = d3.scaleLinear()
            .domain([0, d3.max(this.data, function (d) { return d.bpm; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.date) })
                .y(function (d) { return y(d.bpm) })
            )
            .call(this.transition);

    }
}