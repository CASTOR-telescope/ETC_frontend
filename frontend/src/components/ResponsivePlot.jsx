/**
 * Basically taken from <https://stackoverflow.com/a/66083366>
 */
import { useResizeDetector } from "react-resize-detector";
import Plot from "react-plotly.js";

/**
 * TODO: finish docstring
 */
export default function ResponsivePlot(props) {
  const { width, height, ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 10,
  });
  const { layout, data, ...otherProps } = props;
  return (
    <div ref={ref} style={{ display: "flex", height: "100%" }}>
      <Plot
        data={data}
        layout={{
          ...layout,
          ...{
            width: width,
            height: height,
          },
        }}
        {...otherProps}
      />
    </div>
  );
}
