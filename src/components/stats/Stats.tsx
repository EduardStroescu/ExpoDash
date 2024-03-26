import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import Colors from "@/lib/constants/Colors";
import { useOrderStatistics } from "@/app/api/orders";
import { useRealtimeAdminOrderStatistics } from "@/lib/hooks/useSupabaseRealtime";

const DOT_COLORS = ["#009FFF", "#cf80f3"];
const DOT_GRADIENT_COLORS = ["#023577", "#380152"];

export function Stats() {
  useRealtimeAdminOrderStatistics();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("day");
  const [displayedStats, setDisplayedStats] = useState<number[]>([]);

  const { data: stats, error } = useOrderStatistics();

  useEffect(() => {
    if (stats && selectedTimePeriod) {
      const newOrdersKey =
        `total_new_orders_${selectedTimePeriod}` as keyof typeof stats;
      const deliveredOrdersKey =
        `total_delivered_orders_${selectedTimePeriod}` as keyof typeof stats;
      setDisplayedStats([stats[newOrdersKey], stats[deliveredOrdersKey]]);
    }
  }, [stats, selectedTimePeriod]);

  const getPieData = () => [
    {
      value: displayedStats[0],
      color: DOT_COLORS[0],
      gradientCenterColor: DOT_GRADIENT_COLORS[0],
      focused: true,
    },
    {
      value: displayedStats[1],
      color: DOT_COLORS[1],
      gradientCenterColor: DOT_GRADIENT_COLORS[1],
    },
  ];

  if (error) {
    return null;
  }

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#232b5d85",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Orders
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => setSelectedTimePeriod("day")}>
            <Text style={styles.text}>Day</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedTimePeriod("week")}>
            <Text style={styles.text}>Week</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedTimePeriod("month")}>
            <Text style={styles.text}>Month</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedTimePeriod("year")}>
            <Text style={styles.text}>Year</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ padding: 20, alignItems: "center" }}>
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{ fontSize: 32, color: "white", fontWeight: "bold" }}
                >
                  {displayedStats[1]}
                </Text>
                <Text style={{ fontSize: 14, color: "white" }}>
                  / {selectedTimePeriod}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {RenderLegendComponent(selectedTimePeriod, displayedStats)}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: Colors.light.tint, fontWeight: "bold" },
});

function RenderDot(color: string) {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
}

function RenderLegendComponent(
  selectedTimePeriod: string,
  displayedStats: number[],
) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
          gap: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {RenderDot(DOT_COLORS[0])}
          <Text style={{ color: "white" }}>
            New / {selectedTimePeriod}: {displayedStats[0]}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {RenderDot(DOT_COLORS[1])}
          <Text style={{ color: "white" }}>
            Delivered / {selectedTimePeriod}: {displayedStats[1]}
          </Text>
        </View>
      </View>
    </>
  );
}
