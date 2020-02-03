import { Component, ElementRef, Input, OnChanges, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
    // encapsulation: ViewEncapsulation.None,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('barchart', { static: false })
    private chartContainer: ElementRef;

    constructor() { }

    @Input() statsData;
    fullData: any = [];
    previousData = false;
    nextData = false;
    dataIndex: number;
    prevClick: boolean;
    nextClick: boolean;
    prevDataIndex: number;
    nextDataIndex: number;
    selectedData: any = [];
    selectAmount = 30;
    displayMonthRange: string;

    ngOnInit() {
        this.checkWindowWidth();
        this.prepareData();
    }

    ngAfterViewInit() {
        if (!!this.statsData) {
            this.createBarChart();
        }
    }

    onResize() {
        if (!!this.statsData) {
            let lastSelectAmount = this.selectAmount;
            this.checkWindowWidth();
            if (lastSelectAmount !== this.selectAmount) {
                this.dataIndex = this.fullData.length;
                this.selectDataPrevious(true);
            }
            this.createBarChart();
        }
    }

    checkWindowWidth() {
        if (window.innerWidth >= 1000) {
            this.selectAmount = 30;
        } else {
            this.selectAmount = 12;
        }
    }

    ngOnChanges() {
        if (this.chartContainer) {
            this.prepareData();
            this.createBarChart();
        }
    }

    datesAreOnSameDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    incrementDateByDay(date, increment) {
        return date.setDate(date.getDate() + increment);
    }

    calculateFrequency(rangeData, bpmData) {
        var frequencyData = [...rangeData];
        var bpmIndex = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            var sameDate = this.datesAreOnSameDay(new Date(frequencyData[i].date), new Date(bpmData[bpmIndex].createdAt));
            while (sameDate) {
                frequencyData[i].frequency++;
                bpmIndex++;
                if (bpmIndex >= bpmData.length - 1) {
                    break;
                }
                sameDate = this.datesAreOnSameDay(new Date(frequencyData[i].date), new Date(bpmData[bpmIndex].createdAt));
            }
        }
        return frequencyData;
    }

    calculateDateRange(earliestDate, dateDifference) {
        var data = [];
        for (let i = 0; i <= dateDifference; i++) {
            let startDate = new Date(earliestDate.getTime());
            let incrementDate = this.incrementDateByDay(startDate, i);
            data[i] = { date: new Date(incrementDate), frequency: 0 }
        }
        return data;
    }

    prepareData() {
        let bpmData = { ...this.statsData }["sectionBpms"];
        if (!bpmData.length) {
            return;
        }
        let dateExtent = d3.extent(bpmData, (d) => d.createdAt);
        dateExtent = dateExtent.map(d => new Date(d));

        let dateDifference = this.dateDiffInDays(dateExtent[0], dateExtent[1]);
        let dataRange = this.calculateDateRange(dateExtent[0], dateDifference);
        this.fullData = this.calculateFrequency(dataRange, bpmData);
        this.dataIndex = this.fullData.length;
        this.selectDataPrevious(true);
    }

    selectDataNext() {
        var limit = this.fullData.length - 1;

        var selectAmount = this.selectAmount;
        var selectionArray = [];

        if (!this.nextClick) {
            this.dataIndex = this.nextDataIndex;
            selectionArray.push(this.fullData[this.dataIndex]);
        }

        this.prevDataIndex = this.dataIndex;

        while (selectAmount > 0 && this.dataIndex < limit) {
            this.dataIndex++;
            selectAmount--;
            selectionArray.push(this.fullData[this.dataIndex]);
        }

        this.checkButtons();
        this.selectedData = [...selectionArray];

        this.prevClick = false;
        this.nextClick = true;
        this.nextDataIndex = this.dataIndex;

        this.updateChartTitleText(this.selectedData[0], this.selectedData[this.selectedData.length - 1]);
        this.createBarChart();
    }

    selectDataPrevious(init = false) {
        var selectAmount = this.selectAmount;
        var selectionArray = [];

        if (!init && !this.prevClick) {
            this.dataIndex = this.prevDataIndex;
        }

        this.nextDataIndex = this.dataIndex;

        while (selectAmount > 0 && this.dataIndex > 0) {
            this.dataIndex--;
            selectAmount--;
            selectionArray.push(this.fullData[this.dataIndex]);
        }

        if (this.dataIndex === 1) {
            this.dataIndex--;
            selectionArray.push(this.fullData[this.dataIndex]);
        }

        if (!init) {
            this.checkButtons();
        } else {
            this.nextData = false;
            if (selectionArray.length < this.selectAmount || selectionArray[selectionArray.length - 1] === this.fullData[0]) {
                this.previousData = false;
            } else {
                this.previousData = true;
            }
        }

        this.prevDataIndex = this.dataIndex;

        this.prevClick = true;
        this.nextClick = false;

        selectionArray = selectionArray.reverse();
        this.selectedData = [...selectionArray];
        this.updateChartTitleText(this.selectedData[0], this.selectedData[this.selectedData.length - 1]);
        if (!init) {
            this.createBarChart();
        }
    }

    checkButtons() {
        var limit = this.fullData.length - 1;
        if (this.dataIndex >= limit) {
            this.nextData = false;
            this.previousData = true;
        } else if (this.dataIndex === 0) {
            this.nextData = true;
            this.previousData = false;
        } else {
            this.nextData = true;
            this.previousData = true;
        }
    }

    updateChartTitleText(firstMonth, lastMonth) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let startMonth: any = new Date(firstMonth.date).getMonth();
        let endMonth: any = new Date(lastMonth.date).getMonth();
        startMonth = monthNames[startMonth];
        endMonth = monthNames[endMonth];

        if (startMonth === endMonth) {
            this.displayMonthRange = startMonth;
        } else {
            this.displayMonthRange = `${startMonth} — ${endMonth}`;
        }
    }

    createBarChart() {
        const element = this.chartContainer.nativeElement;
        d3.select(element).select("#bar-chart").remove();

        var svg = d3.select(element).append("svg"),
            margin = { top: 20, right: 20, bottom: 30, left: 40 },
            x = d3.scaleBand().padding(0.1),
            y = d3.scaleLinear();

        let yAxisTicks = window.innerWidth >= 1000 ? 12 : 6;
        let maxVal = d3.max(this.selectedData, (d) => d.frequency);
        if (maxVal < yAxisTicks && window.innerWidth >= 1000) {
            yAxisTicks = maxVal;
        }
        x.domain(this.selectedData.map(function (d) { return d.date; }));
        y.domain([0, d3.max(this.selectedData, function (d) { return d.frequency; })]);

        svg
            .attr("width", element.offsetWidth)
            .attr("height", element.offsetHeight)
            .attr("id", "bar-chart");

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        g.append("g")
            .attr("class", "axis axis--x");

        g.append("g")
            .attr("class", "axis axis--y");

        var bounds = svg.node().getBoundingClientRect(),
            width = bounds.width - margin.left - margin.right,
            height = bounds.height - margin.top - margin.bottom;

        x.rangeRound([0, width]);
        y.rangeRound([height, 0]);

        let xAxis = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%d"))
            .tickPadding(15);

        g.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        let yAxis = d3.axisLeft(y).ticks(yAxisTicks);

        g.select(".axis--y")
            .call(yAxis);

        var bars = g.selectAll(".bar")
            .data(this.selectedData);

        bars
            .enter().append("rect")
            .attr("fill", "steelblue")
            .attr("x", function (d) { return x(d.date); })
            .attr("y", function (d) { return y(0); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(0); });

        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function (d) { return y(d.frequency); })
            .attr("height", function (d) { return height - y(d.frequency); })
            .delay(function (d, i) { return (i * 100) })

        bars.attr("x", function (d) { return x(d.date); })
            .attr("y", function (d) { return y(d.frequency); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.frequency); });

        bars.exit()
            .remove();

    }
}