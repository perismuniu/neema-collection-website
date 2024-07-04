import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Overview = () => {

  const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const insights = useSelector(state => state.data.insights)

    console.log(insights)

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

  return <div className="">
    <div className=" flex gap-4 mb-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex-1 flex justify-between flex-col bg-white h-5vh rounded-2xl px-2 py-3"
              >
                <p>{insight.name}</p>
                <p>{insight.value}</p>
                <p>{insight.percentage}</p>
              </div>
            ))}
          </div>
    <Chart type="bar" data={chartData} options={chartOptions} />
  </div>;
};

export default Overview;
