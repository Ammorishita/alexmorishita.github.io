import React, { useEffect, useState } from 'react';

// clock renders
// calculate the offset for the stroke based on seconds
// run update interval every 1 second and transition the stroke offset
// after cycle completes, run every 1 second

function Clock2(props) {
    const [data, updateData] = useState({
        active: true,
        update: true,
        seconds: "",
        minute: "",
        hour: "",
        time: "",
        day: "",
        daydigit: "",
        month: "",
        year: "",
    });

    function animateSeconds() {
        console.log('animate');
        const secondsElement = document.getElementById('seconds');
        const interval = setInterval(() => {
            const date = new Date();
            const seconds = date.getSeconds();
            const ratio = seconds * 157 / 60;
            secondsElement.style.transition = "1s stroke-dashoffset linear";
            secondsElement.style.strokeDashoffset = 157 - ratio;
            updateData({
                ...data,
                update: !data.update
            });
            if (seconds === 59) {
                clearInterval(interval);
                console.log('clearing');
                secondsElement.style.strokeDashoffset = 0;
                setTimeout(() => {
                    secondsElement.style.strokeDasoffset = 157;
                    secondsElement.classList.add('clock__seconds--animate');
                }, 1000);
            }
        }, 1000);
    }

    function updateTime() {
        setInterval(() => {
            const date = new Date();
            const seconds = date.getSeconds();
            const minutes = date.getMinutes();
            const minuteFormat =
                date.getMinutes() < 10 ? `${"0"}${minutes}` : `${minutes}`;
            const hour = (date.getHours() > 12)
                ? date.getHours() - 12
                : date.getHours();
            const secondFormat =
                date.getSeconds() < 10 ? `${"0"}${seconds}` : seconds;
            const time = `${hour}:${minuteFormat}:${secondFormat}`;
            const day = new Date().toLocaleString("en-us", { weekday: "long" });
            const dayDigit = new Date().getDate();
            const month = new Date().toLocaleString("en-us", { month: "short" });
            const year = new Date().getFullYear();
            updateData({
                ...data,
                seconds: secondFormat,
                minutes: minuteFormat,
                hour: hour,
                time: time,
                daydigit: dayDigit,
                day: day,
                month: month,
                year: year
            })
        }, 1000);
    }
    useEffect(() => {
        console.log('1');
        // updateTime();
        // animateSeconds();
    });




    const activeClass = (props.active === "clock")
        ? "clock active"
        : "clock";

    return (
        <div className={activeClass}>
            <div className="clock__interior">
                {/* <svg className={`icon-svg clock__ring`}>
              <use xlinkHref={`#icon-ring`}></use>
            </svg> */}
                <svg id="seconds" className="clock__seconds" viewBox="-.25 0 50.5 50">
                    <circle cx="25" cy="25" r="25" />
                </svg>
                <div className="clock__interior clock__interior--secondary">
                    <div className="clock__time">
                        <span className="clock__detail clock__detail--hour">{data.hour}</span>
                        <span className="clock__detail clock__detail--large">{data.minutes}</span>
                    </div>
                    <div className="clock__info">
                        <span className="clock__detail">
                            {data.day}
                        </span>
                    </div>
                    <div className="clock__info">
                        <span className="clock__detail clock__detail--secondary">
                            {data.daydigit}
                        </span>
                        <span className="clock__detail clock__detail--secondary">
                            {data.month}
                        </span>
                        <span className="clock__detail clock__detail--secondary">
                            {data.year}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Clock2;
