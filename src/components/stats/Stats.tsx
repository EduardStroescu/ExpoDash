import { useOrderStatistics } from "@/app/api/orders";
import { useRealtimeAdminOrderStatistics } from "@/lib/hooks/useSupabaseRealtime";
import { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import { Button, Separator, Text, View } from "tamagui";

const DOT_COLORS = ["#009FFF", "#cf80f3"];
const DOT_GRADIENT_COLORS = ["#023577", "#380152"];
const DisplayableStatDates = ["Day", "Week", "Month", "Year"];

export function Stats() {
  useRealtimeAdminOrderStatistics();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Day");
  const [displayedStats, setDisplayedStats] = useState<number[]>([0, 0]);

  const { data: stats, error } = useOrderStatistics();

  useEffect(() => {
    if (stats && selectedTimePeriod) {
      const newOrdersKey =
        `total_new_orders_${selectedTimePeriod.toLowerCase()}` as keyof typeof stats;
      const deliveredOrdersKey =
        `total_delivered_orders_${selectedTimePeriod.toLowerCase()}` as keyof typeof stats;
      setDisplayedStats([stats[newOrdersKey], stats[deliveredOrdersKey]]);
    }
  }, [stats, selectedTimePeriod]);

  const getPieData = () => [
    {
      value: displayedStats[0] || 0,
      color: DOT_COLORS[0],
      gradientCenterColor: DOT_GRADIENT_COLORS[0],
      focused: true,
    },
    {
      value: displayedStats[1] || 1,
      color: DOT_COLORS[1],
      gradientCenterColor: DOT_GRADIENT_COLORS[1],
    },
  ];

  return (
    <View padding={20} borderRadius={20} backgroundColor="#232b5d85">
      <View flexDirection="row" justifyContent="space-between">
        <Text color="white" fontSize={16} fontWeight="bold">
          Overview
        </Text>
        <View flexDirection="row" gap={10}>
          {DisplayableStatDates.map((date, idx) => {
            return (
              <View key={idx} flexDirection="row" gap={10} alignItems="center">
                <Button
                  unstyled
                  hoverStyle={{ cursor: "pointer" }}
                  onPress={() => setSelectedTimePeriod(date)}
                >
                  <Text
                    fontSize={12}
                    fontWeight="bold"
                    color={date === selectedTimePeriod ? "red" : "$blue10"}
                    $gtMd={{ fontSize: 14 }}
                  >
                    {date}
                  </Text>
                </Button>
                {idx !== date.length - 1 && (
                  <Separator
                    alignSelf="stretch"
                    vertical
                    borderColor="$red10"
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
      <View padding={30} alignItems="center">
        <PieChart
          data={getPieData()}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={"#232B5D"}
          centerLabelComponent={() => {
            return (
              <View justifyContent="center" alignItems="center">
                <Text fontSize={32} color="white" fontWeight="bold">
                  {displayedStats[1]}
                </Text>
                <Text fontSize={14} color="white">
                  / {selectedTimePeriod}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {RenderLegendComponent(displayedStats)}
    </View>
  );
}

function RenderDot(color: string) {
  return (
    <View
      height={10}
      width={10}
      borderRadius={5}
      backgroundColor={color}
      marginRight={10}
    />
  );
}

function RenderLegendComponent(displayedStats: number[]) {
  return (
    <View
      flexDirection="row"
      justifyContent="center"
      marginBottom={10}
      gap={40}
    >
      <View flexDirection="row" alignItems="center">
        {RenderDot(DOT_COLORS[0])}
        <Text color="white">New: {displayedStats[0]}</Text>
      </View>
      <View flexDirection="row" alignItems="center">
        {RenderDot(DOT_COLORS[1])}
        <Text color="white">Delivered: {displayedStats[1]}</Text>
      </View>
    </View>
  );
}
