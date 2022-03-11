import React from "react";
import styled, { css } from "styled-components";

// https://github.com/typescript-cheatsheets/react/blob/main/README.md#you-may-not-need-defaultprops
export type ButtonProps = {
  isPrimary?: boolean;
  onClick?: () => void;
};

export const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0.5em 1em;
  padding: 0.25em 1em;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    background-blend-mode: overlay;
    cursor: pointer;
  }

  ${({ isPrimary = false }: ButtonProps) =>
    isPrimary &&
    css`
      background: palevioletred;
      color: white;
    `}
`;

// class ButtonTwo extends React.Component<ButtonProps> {
//   // handleClick = (): void => {
//   //   this.props.clickHandler(this.props.name);
//   //   console.log("Clicked " + this.props.name);
//   // };
//   // render() {}
// }

// class Content extends React.Component {
//   login = (e) => {
//     e.preventDefault();
//     axios
//       .post("/username", {
//         username: document.getElementById("username").value,
//       })
//       .then((res) => {
//         console.log(res.data);
//       });
//   };

//   render() {
//     return (
//       <div className="p">
//         {" "}
//         <User />
//         <form onSubmit={this.login} method="post">
//           <p>
//             <label htmlFor="email">Email</label>
//             <input
//               type="username"
//               className="w3-input w3-border"
//               id="username"
//               name="username"
//             />
//           </p>
//           <p>
//             <input type="submit" className="w3-button w3-blue" value="Login" />
//           </p>
//         </form>
//       </div>
//     );
//   }
// }
