import React from "react";
import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "antd";

const ActivityHeatmap = () => {
    const value = [
        { date: "2021-09-01", count: 1 },
        { date: "2021-09-02", count: 2 },
        { date: "2021-09-03", count: 3 },
        { date: "2021-09-04", count: 4 },
        { date: "2021-09-05", count: 5 },
        { date: "2021-09-06", count: 6 },
        { date: "2021-09-07", count: 7 },
        { date: "2021-09-08", count: 8 },
        { date: "2021-09-09", count: 9 },
        { date: "2021-09-10", count: 10 },
        { date: "2021-09-11", count: 11 },
        { date: "2021-09-12", count: 12 },
        { date: "2021-09-13", count: 13 },
        { date: "2021-09-14", count: 14 },
        { date: "2021-09-15", count: 15 },
        { date: "2021-09-16", count: 16 },
        { date: "2021-09-17", count: 17 },
        { date: "2021-09-18", count: 18 },
        { date: "2021-09-19", count: 19 },
        { date: "2021-09-20", count: 20 },
        { date: "2021-09-21", count: 21 },
        { date: "2021-09-22", count: 22 },
        { date: "2021-09-23", count: 23 },
        { date: "2021-09-24", count: 24 },
        { date: "2021-09-25", count: 25 },
        { date: "2021-09-26", count: 26 },
        { date: "2021-09-27", count: 27 },
        { date: "2021-09-28", count: 28 },
        { date: "2021-09-29", count: 29 },
        { date: "2021-09-30", count: 30 },
    ];
    return (
        <HeatMap
            value={value}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            startDate={new Date(value[0].date)}
            width='100%'
            rectProps={{ rx: 4 }}
            rectSize={14}
            rectRender={(props, data) => {
                return (
                    <Tooltip placement="top" title={data.count}>
                        <rect {...props} />
                    </Tooltip>
                )
            }}
            panelColors={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
            legendRender={(props) => (
                <rect {...props} rx={4} /> // TODO: Align this to the right sometimes
            )}
        />
    );
};

export default ActivityHeatmap;