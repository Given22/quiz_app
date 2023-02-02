<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    options: {},
    series: {},
  }),
  props: {
    colorData: Array,
    seriesData: Array,
  },
  beforeMount() {
    this.options = {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
        width: "70%",
        height: "60%",
      },
      plotOptions: {
        bar: {
          // horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "16px",
          colors: ["#fff"],
        },
      },
      legend: {
        position: "bottom",
        fontSize: "16px",
        labels: {
          colors: "#fff",
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Modes"],
        labels: {
          style: {
            fontSize: "16px",
            colors: "#fff",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "16px",
            colors: "#fff",
          },
        },
      },
      fill: {
        opacity: 1,
      },

      colors: this.colorData,
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: "150%",
              height: "100%",
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "14px",
                  colors: "#fff",
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "14px",
                  colors: "#fff",
                },
              },
            },
            legend: {
              fontSize: "14px",
              labels: {
                colors: "#fff",
              },
            },
            dataLabels: {
              style: {
                fontSize: "14px",
                colors: ["#fff"],
              },
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: "100%",
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
    width="300px"
    height="300px"
    type="bar"
    :options="options"
    :series="seriesData"
  ></apexchart>
</template>
