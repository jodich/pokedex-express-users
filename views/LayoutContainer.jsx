var React = require("react");

class LayoutContainer extends React.Component {
  render() {

    return (
      <html>
        <head>
          <title>POKÈDEX</title>
          <link rel="stylesheet" href="/style.css"/>
        </head>
        <body>
          <div className="main">
          {this.props.children}

          </div>
        </body>
      </html>
    );
  }
}

module.exports = LayoutContainer;
