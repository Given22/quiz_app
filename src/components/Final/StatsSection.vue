<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { decode_text, convert_ms_to_time } from "@/utils/functions";

import LineChart from "@/components/Charts/LineChart.vue";
import DonutChart from "../Charts/DonutChart.vue";
import ColumnChart from "../Charts/ColumnChart.vue";

import { clearState } from "@/stores/localStorage";

import type {
  Statistic,
  NormalModesStats,
  TimerModeStats,
  AllModesStats,
  Categories,
  Type,
  Difficulty,
} from "@/types/types";

export default defineComponent({
  data: () => ({
    allStats: {
      percentages: [
        {
          name: "Normal mode",
          data: [],
        },
        {
          name: "Timer mode",
          data: [],
        },
      ],
      categories: {
        "General Knowledge": 0,
        "Entertainment: Books": 0,
        "Entertainment: Film": 0,
        "Entertainment: Music": 0,
        "Entertainment: Musicals & Theatres": 0,
        "Entertainment: Television": 0,
        "Entertainment: Video Games": 0,
        "Entertainment: Board Games": 0,
        "Science & Nature": 0,
        "Science: Computers": 0,
        "Science: Mathematics": 0,
        Mythology: 0,
        Sports: 0,
        Geography: 0,
        History: 0,
        Politics: 0,
        Art: 0,
        Celebrities: 0,
        Animals: 0,
        Vehicles: 0,
        "Entertainment: Comics": 0,
        "Science: Gadgets": 0,
        "Entertainment: Japanese Anime & Manga": 0,
        "Entertainment: Cartoon & Animations": 0,
      } as Categories,
      types: {
        multiple: 0,
        boolean: 0,
      } as Type,
      difficulties: {
        easy: 0,
        medium: 0,
        hard: 0,
      } as Difficulty,
      modes: {
        normal: 0,
        timer: 0,
      },
    } as AllModesStats,
    timerStats: {
      percentage: [],
      avg_times: [],
      timeouts: {
        "5s": 0,
        "10s": 0,
        "20s": 0,
        "30s": 0,
      },
      difficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    } as TimerModeStats,
    normalStats: {
      percentage: [],
      questions: [],
      difficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    } as NormalModesStats,
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
      const all = toRaw(this.stats) as Statistic[];
      if (!all) reject(new Error("No Statistics at localstore"));

      all.forEach((q) => {
        if (q.mode) this.allStats.modes[q.mode] += 1;
        if (q.difficulty) {
          for (const dif in q.difficulty) {
            this.allStats.difficulties[dif as keyof Difficulty] +=
              q.difficulty[dif as keyof Difficulty];
            if (q.mode === "normal")
              this.normalStats.difficulty[dif as keyof Difficulty] +=
                q.difficulty[dif as keyof Difficulty];
            if (q.mode === "timer")
              this.timerStats.difficulty[dif as keyof Difficulty] +=
                q.difficulty[dif as keyof Difficulty];
          }
        }
        if (q.type) {
          for (const typ in q.type) {
            this.allStats.types[typ as keyof Type] += q.type[typ as keyof Type];
          }
        }
        if (q.category) {
          for (const category in q.category) {
            this.allStats.categories[category as keyof Categories] +=
              q.category[category as keyof Categories];
          }
        }
        if (q.percents !== undefined) {
          if (q.mode === "normal") {
            this.allStats.percentages[0].data = [
              q.percents,
              ...this.allStats.percentages[0].data,
            ];
            this.normalStats.percentage = [
              q.percents,
              ...this.normalStats.percentage,
            ];
          }
          if (q.mode === "timer") {
            this.allStats.percentages[1].data = [
              q.percents,
              ...this.allStats.percentages[1].data,
            ];
            this.timerStats.percentage = [
              q.percents,
              ...this.timerStats.percentage,
            ];
          }
        }
        if (q.questions_number && q.mode === "normal") {
          this.normalStats.questions = [
            q.questions_number,
            ...this.normalStats.questions,
          ];
        }
        if (q.avg_time && q.mode === "timer") {
          this.timerStats.avg_times = [
            q.avg_time,
            ...this.timerStats.avg_times,
          ];
        }
        if (q.timer_timeout && q.mode === "timer") {
          this.timerStats.timeouts[
            `${
              Number(q.timer_timeout) / 1000
            }s` as keyof TimerModeStats["timeouts"]
          ] += 1;
        }
      });
      resolve(true);
    })
      .then(() => {
        this.ColumnSeries[0].data = [this.allStats.modes.normal];
        this.ColumnSeries[1].data = [this.allStats.modes.timer];
      })
      .then(() => (this.isLoading = false));
  },
});
</script>

<template>
  <div class="StatsSection">
    <header class="StatsHeader">
      <div class="StatsSInfo">
        <input type="radio" id="all" value="all" v-model="MODE" />
        <label class="StatsSetlabel" for="all">All</label>
        <div v-if="normalStats.percentage.length !== 0">
          <input type="radio" id="normal" value="normal" v-model="MODE" />
          <label class="StatsSetlabel" for="normal">Normal</label>
        </div>
        <div v-if="timerStats.percentage.length !== 0">
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
            :seriesData="allStats.percentages"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Category Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(allStats.categories)"
            :labels="Object.keys(allStats.categories)"
            :notShowLegend="true"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Type Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(allStats.types)"
            :labels="Object.keys(allStats.types)"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(allStats.difficulties)"
            :labels="Object.keys(allStats.difficulties)"
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
                data: normalStats.percentage,
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
                data: normalStats.questions,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(normalStats.difficulty)"
            :labels="Object.keys(normalStats.difficulty)"
          />
        </div>
      </div>
      <div v-if="MODE === 'timer'" class="ChartsSection">
        <div class="ChartBox">
          <h3 class="ChartName">Selected Timeouts</h3>
          <DonutChart
            :seriesData="Object.values(timerStats.timeouts)"
            :labels="Object.keys(timerStats.timeouts)"
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
                data: timerStats.percentage,
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
                data: timerStats.avg_times,
              },
            ]"
          />
        </div>
        <div class="ChartBox">
          <h3 class="ChartName">Difficulty Percentage Distribution</h3>
          <DonutChart
            :seriesData="Object.values(timerStats.difficulty)"
            :labels="Object.keys(timerStats.difficulty)"
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
