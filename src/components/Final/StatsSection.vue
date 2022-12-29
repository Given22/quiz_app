<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { decode_text, convert_ms_to_time } from "@/utils/functions";
import { Icon } from "@iconify/vue";

import { clearState } from "@/stores/localStorage";

import type { Statistic } from "@/types/types";

export default defineComponent({
  data: () => ({
    normal: [] as Statistic[],
    timer: [] as Statistic[],
    MODE: "all" as "all" | "normal" | "timer",
    options: {
      chart: {
        id: "vuechart-example",
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
      yaxis: {
        title: {
          text: "Percents",
        },
        min: 0,
        max: 90,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#E9C46A"],
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  }),
  methods: {
    // decode html entities
    decode(str: string) {
      return decode_text(str);
    },

    convert(time: number) {
      return convert_ms_to_time(time);
    },

    clearState(string: string) {
      clearState(string);
    },
  },
  props: {
    stats: Array,
  },
  components: {
    Icon,
  },
  async mounted() {
    const all = toRaw(this.stats) as Statistic[];

    if (!all) return;

    this.normal = all.filter(
      (stats: Statistic) => stats.mode === "normal"
    ) as Statistic[];

    this.timer = all.filter(
      (stats: Statistic) => stats.mode === "timer"
    ) as Statistic[];
  },
});
</script>

<template>
  <div class="StatsSection">
    <header class="StatsHeader">
      <h3>Statistics</h3>
      <Icon icon="fa6-solid:arrow-down-long" height="150" class="StatsIcon" />
      <div class="StatsSInfo">
        <input type="radio" id="all" value="all" v-model="MODE" />
        <label class="StatsSetlabel" for="all">All</label>
        <input type="radio" id="normal" value="normal" v-model="MODE" />
        <label class="StatsSetlabel" for="normal">Normal</label>
        <input type="radio" id="timer" value="timer" v-model="MODE" />
        <label class="StatsSetlabel" for="timer">Timer</label>
      </div>
    </header>
    <div>
      <apexchart
        width="500"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <p>{{ normal }}</p>
    <p>{{ timer }}</p>
    <button type="button" @click="clearState('previous')" class="StatsSetlabel">
      Clear Statistics
    </button>
  </div>
</template>

<style lang="scss">
.StatsSection {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.StatsHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .StatsIcon {
    height: 1.7rem;
  }
}

@media screen and (max-width: 767px) {
  .StatsIcon {
    height: 1.5rem;
  }
}
</style>

<!-- 
  Jakie wykresiki są potrzebne ?

  Dla wszystkich trybów?

   > Liniowy z wynikami procentowymi
   > Heat mapa z dniami
   > Wykres kołowy z kategoriami
   > Wykres kołowy z typami
   > Wykres kołowy z trudnościami
   > Linia z stosunkiem ilości normal / timer
  
  Dla normalnego trybu?

   > Liniowy z wynikami procentowymi
   > Liniowy z ilością pytań
   > kołowy z trudnością

  Dla timera?

    > Kołowy z wybieranym czasem (timeout)
    > Liniowy z wynikami procentowymi
    > Liniowy z średnimi czasami


  Przydatny będzie przycisk do usuwania zapisanych wyników.
  
    Statystyki muszą zostać przebudowane, kategorie / trudność i typ, powinny być objektem posiadającym wszystkie możliwości z liczbą występowania w danym quizie, i po zsumowaniu tego wszystkiego powinny być robione statystyki. DONE

 -->
