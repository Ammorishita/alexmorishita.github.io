import React from "react";
import * as d3 from "d3";

class Stocks extends React.Component {
  constructor(props) {
    super();
    this.getPosition = this.getPosition.bind(this);
    this.alphaVantage = "RRAKWSIC29SVJZ4O";
    this.history = [];
    this.state = {
      active: true
    };
    this.getStatus = this.getStatus.bind(this);
    this.addTicker = this.addTicker.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.trigger = this.trigger.bind(this);
    this.generateResults = this.generateResults.bind(this);
    this.buildChart = this.buildChart.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://d3js.org/d3.v5.min.js";
    document.head.appendChild(script);
    setTimeout(() => {
      this.setState({
        mounted: true
      });
    }, 500);
  }

  trigger(e) {
    const code = e.keyCode;
    if (code === 13) {
      const button = document.querySelector(".stock__button");
      button.click();
    }
  }

  getStatus() {
    if (this.state.active === false) {
      return (
        <div className="stock__error">
          <p className="stock__text">No Results Found</p>
          <p className="stock__text">
            Try entering a different stock ticker symbol.
          </p>
        </div>
      );
    }
  }

  addTicker(e) {
    const target = e.target;
    const input = document.querySelector(".input__ticker");
    if (target.classList.contains("stock__button")) {
      const value = input.value;
      this.sendRequest(value, "hour");
      this.setState({
        stock: value
      });
    } else if (target.classList.contains("stock__button--alt")) {
      if (this.state.active) {
        const interval = target.getAttribute("data-interval");
        const stockValue = input.value !== "" ? input.value : this.state.stock;
        this.sendRequest(stockValue, interval);
        this.setState({
          stock: stockValue
        });
      } else {
        // cant search while invalid result
      }
    }
  }

  sendRequest(ticker, interval) {
    const hourly = "TIME_SERIES_INTRADAY";
    const weekly = "TIME_SERIES_WEEKLY";
    let sendNewRequest = true;
    const stockButtons = document.querySelectorAll(".stock__button--alt");
    for (let i = 0; i < stockButtons.length; i++) {
      stockButtons[i].classList.remove("active");
    }
    const activeButton = document.querySelector(
      `[data-interval="${interval}"]`
    );
    activeButton.classList.add("active");
    const outputSize =
      interval === "hour" ? "full" : interval === "day" ? "full" : "compact";
    const stockFunction =
      interval === "hour" ? hourly : interval === "day" ? hourly : weekly;
    const url = `https://www.alphavantage.co/query?function=${stockFunction}&symbol=${ticker}&interval=5min&outputsize=${outputSize}&apikey=${this.alphaVantage}`;
    this.setState({
      active: true
    });
    for (let i = 0; i < this.history.length; i++) {
      const stock = this.history[i];
      const stockName = stock.name;
      const stockInterval = stock.interval;
      const tickerLower = ticker.toLowerCase();
      if (stockName === tickerLower) {
        if (
          interval === "hour" ||
          interval === "day" ||
          interval === stockInterval
        ) {
          this.generateResults(stock.data, interval);
          sendNewRequest = false;
          break;
        }
      }
    }
    if (sendNewRequest === true) {
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(response => {
          this.generateResults(response, interval);
          const parsedTicker = ticker.toLowerCase();
          const stockObj = {
            name: parsedTicker,
            data: response,
            interval: interval
          };
          this.history.push(stockObj);
        })
        .catch(error => {
          console.log("There was an error fetching alpha vantage", error);
          this.setState({
            active: false
          });
        });
    }
  }

  generateResults(result, interval) {
    console.log('result', result);
    const allData = [];
    let data =
      interval === "hour"
        ? result["Time Series (5min)"]
        : interval === "day"
          ? result["Time Series (5min)"]
          : result["Weekly Time Series"];
    //each result item has a key value of date and value
    let dataCount = 0;
    for (const item in data) {
      if (dataCount === 100 && interval === "hour") {
        break;
      } else if (dataCount === 500 && interval === "day") {
        break;
      } else if (dataCount === 52 && interval === "week") {
        break;
      }
      const line = data[item];
      const dateTime = new Date(item);
      //each value has close/open stock prices for that day
      for (const prop in line) {
        //take just the close value for our charts
        if (prop === "4. close") {
          const value = line[prop];
          allData.push({
            date: dateTime,
            value: Number(value)
          });
        }
      }
      dataCount++;
    }
    this.buildChart(allData, interval);
  }
  buildChart(data, interval) {
    console.log('buiding data', data);
    //clear the existing chart
    // console.log('data', data);
    d3.selectAll(".stock__graph--container > *").remove();

    const endDate = data[0].date;
    const startDate = data[data.length - 1].date;
    let closingDate = "";
    let closingIndex = 77;
    if (interval === "hour") {
      for (let i = data.length - 1; i >= 0; i--) {
        const val = data[i].date;
        const date = new Date(val);
        const hour = date.getHours();
        const day = date.getDay();
        const prevDay = data[i - 1].date.getDay();
        if (day !== prevDay && i > 0) {
          closingDate = data[i].date;
          closingIndex = i;
          console.log('setting');
          break;
        } else if (hour === 16) {
          console.log('data1', data);
          closingDate = data[i].date;
          closingIndex = i;
          console.log('setting 16')
          break;
        }
      }
    } else if (interval === "day") {
      closingDate = data[375].date;
      console.log('closing', closingDate);
    }
    let tickValues = [];

    const dataLength = data.length;
    const dataInterval = Math.floor(dataLength / 4);
    const container = document.querySelector(".stock__container--chart");
    const width = container.getBoundingClientRect().width;
    const height = width * 0.45;

    const svg = d3
      .select(".stock__graph--container")
      .attr("width", "80%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMin");

    const g = svg.append("g");

    const stockTimeDomain = function () {
      if (interval === "hour") {
        const openingDate = data[closingIndex - 1].date;
        const domain = [startDate, closingDate, openingDate, endDate];
        console.log('start', startDate);
        console.log('closing', closingDate);
        console.log('opening', openingDate);
        console.log('enddate', endDate);
        //Tick Values
        for (let i = data.length - 1; i >= 0; i -= dataInterval) {
          const val = data[i].date;
          tickValues.push(val);
        }
        tickValues.push(endDate);
        return domain;
      } else if (interval === "day") {
        const domain = [startDate];
        for (let i = 499, j = 1; i >= 0; i--, j++) {
          const val = data[i].date;
          const day = val.getDay();
          const prevDay =
            i < 499 ? data[i + 1].date.getDay() : data[i].date.getDay();
          if (day !== prevDay && i > 0) {
            // const index = Math.floor((100 - i) * (width / 100));
            const closingDate = data[i + 1].date;
            const openingDate = data[i].date;
            domain.push(closingDate);
            domain.push(openingDate);
            tickValues.push(closingDate);
          }
        }
        domain.push(endDate);
        tickValues.push(data[0].date);
        return domain;
      } else if (interval === "week") {
        for (let i = data.length - 1; i >= 0; i--) {
          const val = data[i].date;
          if (i % 12 === 0) {
            tickValues.push(val);
          }
        }
        const domain = [startDate, endDate];
        return domain;
      }
    };

    const stockTimeRange = function () {
      if (interval === "hour") {
        const range = [0];
        for (let i = 99; i >= 0; i--) {
          const val = data[i].date;
          const day = val.getDay();
          const hour = val.getHours();
          const prevDay = i < 99
            ? data[i + 1].date.getDay()
            : data[i].date.getDay();
          if ((day !== prevDay || hour === 16) && i > 0) {
            const index = Math.floor((100 - i) * (width / 100));
            range.push(index - 1);
            range.push(index - 1);
            range.push(width);
            break;
          }
        }
        range.push(width);
        return range;
      } else if (interval === "day") {
        const range = [0];
        for (let i = 499, j = 0; i >= 0; i--) {
          const val = data[i].date;
          const day = val.getDay();
          const prevDay = i < 499 ? data[i + 1].date.getDay() : val.getDay();
          j++;
          if (day !== prevDay && i > 0) {
            const index = Math.floor((j * width) / 500);
            range.push(index - 1);
            range.push(index);
          }
        }
        range.push(width);
        return range;
      } else if (interval === "week") {
        const range = [0, width];
        return range;
      }
    };

    const x = d3
      .scaleTime()
      .domain(stockTimeDomain())
      .range(stockTimeRange());

    const y = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return d.value;
        })
      )
      .rangeRound([height, 0]);

    const line = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.value);
      });

    const xAxis = d3
      .axisBottom(x)
      .tickValues(tickValues)
      .tickFormat(function (date) {
        if (interval === "hour") {
          return d3.timeFormat("%I:%M %p")(date);
        } else if (interval === "day") {
          return d3.timeFormat("%b %d")(date);
        } else if (interval === "week") {
          return d3.timeFormat("%b %Y")(date);
        }
      });
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("g").call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("class", "d3-graph")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    var mouseG = svg.append("g").attr("class", "mouse-over-effects");

    mouseG
      .append("circle")
      .attr("r", 7)
      .attr("class", "tracer")
      .style("stroke-width", "2px")
      .style("stroke", "#ff64ff")
      .style("opacity", 0);

    const legend = svg
      .append("text")
      .attr("class", "stock-legend")
      .style("font", "16px sans-serif")
      .style("fill", "#fff")
      .attr("x", 10)
      .attr("y", -15);

    mouseG
      .append("path") // this is the vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#ff64ff")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mouseG
      .append("svg:rect") // append a rect to catch mouse movements on canvas
      .attr("width", width + 1) // can't catch mouse events on a g element
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout touchend", function () {
        // on mouse out hide line, circles and text
        d3.select(".mouse-line").style("opacity", "0");
        d3.selectAll(".mouse-per-line circle").style("opacity", "0");
        d3.selectAll(".mouse-per-line text").style("opacity", "0");
        d3.select(".tracer").style("opacity", "0");
      })
      .on("mouseover touchstart", function () {
        // on mouse in show line, circles and text
        d3.select(".mouse-line").style("opacity", "1");
        d3.selectAll(".mouse-per-line circle").style("opacity", "1");
        d3.selectAll(".mouse-per-line text").style("opacity", "1");
      })
      .on("mousemove click touchmove", function () {
        // mouse moving over canvas
        const mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function () {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          })
          .style("opacity", "1");
        d3.select(".mouse-per-line text").style("opacity", "1");
        const date = x.invert(mouse[0]);
        const bisect = d3.bisector((d, x) => x - d.date).left;
        const dateIndex = bisect(data, date);
        let xIndex = dateIndex === data.length ? data.length - 1 : dateIndex;
        //check if index is within range todo
        const priceValue = data[xIndex].value;
        const xRange = x(date);
        const yRange = y(priceValue);
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        };
        const price = Math.ceil(priceValue * 100) / 100;
        const dateValue = new Intl.DateTimeFormat("en-US", options).format(
          date
        );
        d3.select(".tracer")
          .attr("cx", xRange)
          .attr("cy", yRange)
          .style("opacity", 1);
        if (date > data[0].date || date < data[data.length - 1].date) {
          d3.select(".tracer").style("opacity", "0");
          d3.select(".mouse-line").style("opacity", "0");
          d3.select(".mouse-per-line text").style("opacity", "0");
        } else {
          legend.text(`Price $${price}: Date ${dateValue}`);
        }
      });
  }

  getPosition() {
    if (this.state.mounted) {
      const styles = {
        transform: "translateX(0)"
      };
      return styles;
    }
  }

  render() {
    const activeClass = (this.props.active === "stocks")
      ? "stock active"
      : "stock";
    const errorStatus = (!this.state.active)
      ? "stock__error--active"
      : "";
    return (
      <div className={activeClass} style={this.getPosition()}>
        <div className="stock__container">
          <div className="stock__interface flex-center flex-nowrap">
            <input
              className="input__ticker"
              type="text"
              placeholder="Search Stock Ticker"
              onKeyUp={this.trigger}
            ></input>
            <button
              type="button"
              className="stock__button button"
              onClick={this.addTicker}
            >
              Search
            </button>
          </div>
          <div className="stock__container--chart flex-center">
            <div className="stock__buttons">
              <button
                type="button"
                className="button stock__button--alt"
                data-interval="hour"
                onClick={this.addTicker}
              >
                1 Day
              </button>
              <button
                type="button"
                className="button stock__button--alt"
                data-interval="day"
                onClick={this.addTicker}
              >
                7 Days
              </button>
              <button
                type="button"
                className="button stock__button--alt"
                data-interval="week"
                onClick={this.addTicker}
              >
                12 Months
              </button>
            </div>
            <svg className="stock__graph--container"></svg>
          </div>
          <div className={`stock__error ${errorStatus}`}>
            <p className="stock__text">No Results Found</p>
            <p className="stock__text stock__text--small">
              Try entering a different stock ticker symbol.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Stocks;
