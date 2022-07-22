class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(
        neuronCounts[i], neuronCounts[i + 1]
      ));
    }
  }

  static feedForward(givenInputs, network) {
    // Create first level of outputs
    let outputs = Level.feedForward(
      givenInputs, network.levels[0],
    );

    // Create remainig level outputs
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(
        outputs, network.levels[i],
      );
    }

    return outputs;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach(level => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(
          level.biases[i],
          Math.random() * 2 - 1,
          amount
        )
      }

      for (const element of level.weights) {
        for (let j = 0; j < element.length; j++) {
          element[j] = lerp(
            element[j],
            Math.random() * 2 - 1,
            amount
          )
        }
      }
    });
  }
}
class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);

    // Outputs have a specific bias value
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      // Each input node will have {outputCount} connections
      this.weights[i] = new Array(outputCount);
    }

    // Start with some random values
    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // Set random weight between -1 and 1
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // Calculate output of a node -> whether to turn on or off
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}