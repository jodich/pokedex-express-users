var React = require("react");

class Delete extends React.Component {
  render() {

    return (
      <html>
        <head />
        <body>
          <h4>Delete this Pokemon?</h4>
          <ul>
            <li>Id: {this.props.pokemon.id}</li>
            <li>Name: {this.props.pokemon.name}</li>
            <li>Num: {this.props.pokemon.num}</li>
            <li>Img: {this.props.pokemon.img}</li>
            <li>Weight: {this.props.pokemon.weight}</li>
            <li>Height: {this.props.pokemon.height}</li>
          </ul>
          <form
            className="pokemon-form"
            method="POST"
            action={"/pokemon/"+ this.props.pokemon.id + "?_method=DELETE"}
          >
          <input value="Delete" name="submit" type="submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Delete;
