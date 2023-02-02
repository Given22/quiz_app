<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    options: {},
    series: {},
  }),
  props: {
    categoriesY: Array,
    colorData: Array,
    seriesData: Array,
    max: Number,
  },
  beforeMount() {
    this.options = {
      chart: {
        id: "LineChart",
        fontFamily: "Righteous, Arial, sans-serif",
        background: "transparent",
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
      xaxis: {
        categories: [],
        labels: {
          show: false,
        },
      },
      yaxis: {
        categories: this.categoriesY,
        min: 0,
        max: this.max,
        axisBorder: {
          show: true,
          color: "#fff",
        },
        labels: {
          style: {
            colors: "#fff",
            fontSize: "14px",
            fontWeight: "normal",
          },
        },
      },
      stroke: {
        curve: "smooth",
      },
      colors: this.colorData,
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: "100%",
              height: "90%",
            },
            yaxis: {
              labels: {
                style: {
                  colors: "#fff",
                  fontSize: "14px",
                },
              },
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: "150%",
              height: "100%",
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
    width="350px"
    height="275px"
    type="line"
    :options="options"
    :series="seriesData"
  ></apexchart>
</template>
