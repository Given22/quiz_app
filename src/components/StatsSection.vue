<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { decode_text, convert_ms_to_time } from "@/utils/functions";

import LineChart from "@/components/Charts/LineChart.vue";
import DonutChart from "./Charts/DonutChart.vue";
import ColumnChart from "./Charts/ColumnChart.vue";

import { clearState } from "@/stores/localStorage";

import {
  create_display_stats,
  isDisStat,
  emptyDisplayStatistics,
} from "@/utils/statistics";

import type { Statistic } from "@/types/types";

export default defineComponent({
  data: () => ({
    displayableStatistics: emptyDisplayStatistics,
    MODE: "all" as "all" | "normal" | "timer",
    categoriesY: [0, 20, 40, 60, 80, 90, 100],
    colors: ["#E9C46A", "#fff"],
    isLoading: true,
    ColumnSeries: [
      { name: "normal", data: [0] },
      { name: "time", data: [0] },
    ],
  }),
  methods: {
    decode: decode_text,
    convert: convert_ms_to_time,
    clearState,
  },
  props: {
    stats: Array,
  },
  components: {
    LineChart,
    DonutChart,
    ColumnChart,
  },
  mounted() {
    new Promise((resolve, reject) => {
      try {
        const all = toRaw(this.stats) as Statistic[];
        if (!all) throw new Error("No Statistics at state management");
        resolve(create_display_stats(all));
      } catch (e) {
        reject(e);
      }
    })
      .then((val) => {
        if (isDisStat(val)) {
          this.displayableStatistics = val;
        }
      })
      .then(() => {
        this.ColumnSeries[0].data = [
          this.displayableStatistics.allStats.modes.normal,
        ];
        this.ColumnSeries[1].data = [
          this.displayableStatistics.allStats.modes.timer,
        ];
      })
      .then(() => (this.isLoading = false));
  },
});
</script>

<template>
  <div class="StatsSection" v-if="displayableStatistics">
    <header class="StatsHeader">
      <div class="StatsSInfo">
        <input type="radio" id="all" value="all" v-model="MODE" />
        <label class="StatsSetlabel" for="all">All</label>
        <div v-if="displayableStatistics.normalStats.percentage.length !== 0">
          <input type="radio" id="normal" value="normal" v-model="MODE" />
          <label class="StatsSetlabel" for="normal">Normal</label>
        </div>
        <div v-if="displayableStatistics.timerStats.percentage.length !== 0">
          <input type="radio" id="timer" value="timer" v-model="MODE" />
          <label class="StatsSetlabel" for="timer">Timer</label>
        </div>
      </div>
    </header>
    <section class="ChartsSections" v-if="!isLoading">
      <div v-if="MODE === 'all'" class="ChartsSection">
        <div class="ChartBox">
          <h3 class="ChartName">Percentage Results</h3>
          <LineChart
            :categoriesY="categoriesY"
            :max="100"
            :colorData="['#E9C46A', '#fff']"
            :seriesData="displayableStatistics.allStats.percentages"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Category Percentage Distribution</h3>
          <DonutChart
            :seriesData="
              Object.values(displayableStatistics.allStats.categories)
            "
            :labels="Object.keys(displayableStatistics.allStats.categories)"
            :notShowLegend="true"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Type Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(displayableStatistics.allStats.types)"
            :labels="Object.keys(displayableStatistics.allStats.types)"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="
              Object.values(displayableStatistics.allStats.difficulties)
            "
            :labels="Object.keys(displayableStatistics.allStats.difficulties)"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Selected Modes</h3>
          <ColumnChart :seriesData="ColumnSeries" />
        </div>
      </div>
      <div v-if="MODE === 'normal'" class="ChartsSection">
        <div class="ChartBox">
          <h3 class="ChartName">Percentage Results</h3>
          <LineChart
            :categoriesY="categoriesY"
            :max="100"
            :colorData="['#E9C46A']"
            :seriesData="[
              {
                name: 'normal',
                data: displayableStatistics.normalStats.percentage,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Number of question</h3>
          <LineChart
            :categoriesY="categoriesY"
            :colorData="colors"
            :max="25"
            :seriesData="[
              {
                name: 'normal',
                data: displayableStatistics.normalStats.questions,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="
              Object.values(displayableStatistics.normalStats.difficulty)
            "
            :labels="Object.keys(displayableStatistics.normalStats.difficulty)"
          />
        </div>
      </div>
      <div v-if="MODE === 'timer'" class="ChartsSection">
        <div class="ChartBox">
          <h3 class="ChartName">Selected Timeouts</h3>
          <DonutChart
            :seriesData="
              Object.values(displayableStatistics.timerStats.timeouts)
            "
            :labels="Object.keys(displayableStatistics.timerStats.timeouts)"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Percentage Results</h3>
          <LineChart
            :categoriesY="categoriesY"
            :colorData="['#fff']"
            :max="100"
            :seriesData="[
              {
                name: 'timer',
                data: displayableStatistics.timerStats.percentage,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Average One question Time</h3>
          <LineChart
            :categoriesY="categoriesY"
            :max="30"
            :colorData="['#fff']"
            :seriesData="[
              {
                name: 'timer',
                data: displayableStatistics.timerStats.avg_times,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="
              Object.values(displayableStatistics.timerStats.difficulty)
            "
            :labels="Object.keys(displayableStatistics.timerStats.difficulty)"
          />
        </div>
      </div>
    </section>
    <button type="button" @click="clearState('previous')" class="CleanBtn">
      Clear Statistics
    </button>
  </div>
</template>

<style lang="scss">
.StatsSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  margin-bottom: 3rem;
}
.StatsHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h3 {
  letter-spacing: 0.1rem;
}

.ChartName {
  letter-spacing: 0.05rem;
}

.StatsIcon {
  height: 2.5rem;
  animation: arrow 2s infinite ease;
  position: relative;
}

.StatsSInfo {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
  gap: 1rem;
  .StatsSetlabel {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 1.7rem;
    min-width: 10rem;
    border: 0px solid;
    color: var(--color-green-dark);
    background-color: var(--color-yellow);
    font-size: 1rem;
    font-family: "Righteous";
    border-radius: 10px;
    padding: 0.5rem 2rem;
    box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
      3px 10px 5px rgba(0, 0, 0, 0.25);
  }
}

input[type="radio"] {
  display: none;
}

input[type="radio"]:checked + .StatsSetlabel {
  opacity: 1;
  &:hover {
    color: var(--color-green-light);
  }
}

input[type="radio"]:not(:checked) + .StatsSetlabel {
  opacity: 0.5;
  transform: translateY(5px);
  box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
    0px 0px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    opacity: 1;
  }
}

.ChartsSections {
  width: 70%;
}

.ChartsSection {
  display: flex;
  gap: 3rem;
  flex-direction: row;
  flex-wrap: wrap;
}

.ChartBox {
  flex-basis: 150px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-green-light);
  font-family: "Righteous";
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: 0px 10px 0px rgba(0, 0, 0, 0.25);
}

.CleanBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 1.7rem;
  min-width: 10rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-orange);
  font-size: 1rem;
  font-family: "Righteous";
  border-radius: 10px;
  padding: 0.5rem 2rem;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
}

@keyframes arrow {
  0% {
    transform: translateY(0);
    transform: scaleY(1);
  }
  45% {
    transform: translateY(30%);
    transform: scaleY(1.05);
  }
  90% {
    transform: translateY(-10%);
  }
  100% {
    transform: scaleY(1);
    transform: translateY(0);
  }
}

@media screen and (min-width: 1024px) {
  .StatsIcon {
    height: 2rem;
  }
  .ChartsSections {
    width: 70%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .StatsIcon {
    height: 1.7rem;
  }
  .ChartsSections {
    width: 70%;
  }
  .StatsSInfo .StatsSetlabel {
    min-width: 9rem;
  }
}

@media screen and (max-width: 767px) {
  .StatsIcon {
    height: 1.5rem;
  }
  .ChartsSections {
    width: 90%;
  }
  .StatsSInfo .StatsSetlabel {
    min-width: 8rem;
  }
}
</style>
