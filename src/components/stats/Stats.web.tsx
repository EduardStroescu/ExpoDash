import React, { useEffect, useState } from "react";
import Colors from "@/lib/constants/Colors";
import { useOrderStatistics } from "@/app/api/orders";

const DOT_COLORS = ["#009FFF", "#cf80f3"];
const DOT_GRADIENT_COLORS = ["#023577", "#380152"];

export function Stats() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("day");
  const [displayedStats, setDisplayedStats] = useState<number[]>([]);

  const { data: stats } = useOrderStatistics();

  useEffect(() => {
    if (stats && selectedTimePeriod) {
      const newOrdersKey =
        `total_new_orders_${selectedTimePeriod}` as keyof typeof stats;
      const deliveredOrdersKey =
        `total_delivered_orders_${selectedTimePeriod}` as keyof typeof stats;
      setDisplayedStats([stats[newOrdersKey], stats[deliveredOrdersKey]]);
    }
  }, [stats, selectedTimePeriod]);

  return <></>;
}
