import React, { PureComponent } from "react";
import ReactTooltip from "react-tooltip";

class Tooltip extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <span data-tip data-for={this.props.id}>
          {this.props.children}
        </span>
        <ReactTooltip
          place={this.props.place || "top"}
          id={this.props.id}
          type={this.props.type}
          effect={this.props.effect}
        >
          <span>{this.props.tooltipContent}</span>
        </ReactTooltip>
      </React.Fragment>
    );
  }
}

export default Tooltip;
