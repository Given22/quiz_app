<script lang="ts">
import { defineComponent, toRaw } from "vue";

export default defineComponent({
  data: () => ({
    options: {},
  }),
  props: {
    seriesData: Array,
    labels: Array,
    notShowLegend: Boolean,
  },
  beforeMount() {
    this.options = {
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
          },
          expandOnClick: false,
        },
      },
      chart: {
        id: "DonutChart",
        fontFamily: "Righteous, Arial, sans-serif",
        background: "transparent",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      labels: this.labels,
      legend: {
        position: "bottom",
        // showForZeroSeries: false,
        show: toRaw(this.notShowLegend) ? false : true,
        width: "100%",
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: "110%",
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: "100%",
            },
          },
        },
      ],
    };
  },
});
</script>

<template>
  <apexchart
    width="500px"
    type="donut"
    :options="options"
    :series="seriesData"
  ></apexchart>
</template>
