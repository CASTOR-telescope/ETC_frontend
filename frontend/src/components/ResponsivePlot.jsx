/**
 * Basically taken from <https://stackoverflow.com/a/66083366> but optimized performance
 * based on <https://github.com/maslianok/react-resize-detector#performance-optimization>
 */
import { useCallback } from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";

// /**
//  * TODO: finish docstring
//  */
// export default function ResponsivePlot(props) {
//   const { width, height, ref } = useResizeDetector({
//     refreshMode: "debounce",
//     refreshRate: 10,
//   });
//   const { layout, data, ...otherProps } = props;
//   return (
//     <div ref={ref} style={{ display: "flex", height: "100%" }}>
//       <Plot
//         data={data}
//         layout={{
//           ...layout,
//           ...{
//             width: width,
//             height: height,
//           },
//         }}
//         {...otherProps}
//       />
//     </div>
//   );
// }

/**
 * TODO: finish docstring
 */
export default function ResponsivePlot(props) {
  const { layout, data, ...otherProps } = props;
  const onResize = useCallback(() => {}, []);
  const { ref, width, height } = useResizeDetector({
    onResize,
    refreshMode: "debounce",
    refreshRate: 10,
  });
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
