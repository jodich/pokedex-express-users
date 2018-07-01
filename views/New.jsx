var React = require("react");
var LayoutContainer = require("./LayoutContainer.jsx");

class New extends React.Component {
  render() {
    return (
      <LayoutContainer>
      <h1>Create a New Pokemon!</h1>
      <div className="all_forms">
        <form className="pokemon-form form_page" method="POST" action="/pokemon">
          <div className="pokemon-attribute create">
            <input className="input_style" name="num" type="text" placeholder="num" />
          </div>
          <div className="pokemon-attribute create">
            <input className="input_style" name="name" type="text" placeholder="name" />
          </div>
          <div className="pokemon-attribute create">
            <input className="input_style" name="img" type="text" placeholder="image" />
          </div>
          <div className="pokemon-attribute create">
            <input className="input_style" name="height" type="text" placeholder="height" />
          </div>
          <div className="pokemon-attribute create">
            <input className="input_style" name="weight" type="text" placeholder="weight"/>
          </div>
          <input className="btn_input_style" type="submit" value="Submit" />
        </form>
        </div>
      </LayoutContainer>
    );
  }
}

module.exports = New;
