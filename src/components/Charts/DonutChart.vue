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
        width: "70%",
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
      dataLabels: {
        style: {
          // colors: "#fff",
          fontSize: "16px",
        },
      },
      legend: {
        position: "bottom",
        // showForZeroSeries: false,
        show: toRaw(this.notShowLegend) ? false : true,
        width: "100%",
        fontSize: "16px",
        labels: {
          colors: "#fff",
        },
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: "130%",
            },
            dataLabels: {
              style: {
                fontSize: "12px",
                fontWeight: "normal"
              },
            },
            legend: {
              fontSize: "14px",
              labels: {
                colors: "#fff",
              },
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: "80%",
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
    type="donut"
    :options="options"
    :series="seriesData"
  ></apexchart>
</template>
