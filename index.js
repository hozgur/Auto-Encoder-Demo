console.log("Hello Autoencoder 🚂");

import * as tf from "@tensorflow/tfjs-node";
// import canvas from "canvas";
// const { loadImage } = canvas;
import Jimp from "jimp";
import numeral from "numeral";

const W = 28;
const imageCount = 2500;
main();

async function main() {
  console.log(tf.getBackend());
  // Build the model
  const { decoderLayers, autoencoder } = buildModel();
  // load all image data
   const images = await loadImages(imageCount);
  // // train the model
   const x_train = tf.tensor2d(images.slice(0, imageCount - 1));
   await trainModel(autoencoder, x_train, 200);
   const saveResults = await autoencoder.save("file://public/model/");

  // console.log(autoencoder.summary());

  //const autoencoder = await tf.loadLayersModel("file://public/model/model.json");
  // test the model
  const x_test = tf.tensor2d(images.slice(0,50));
  await generateTests(autoencoder, x_test);

  // Create a new model with just the decoder
  const decoder = createDecoder(decoderLayers);
  const saveDecoder = await decoder.save("file://public/decoder/model/");
}

async function generateTests(autoencoder, x_test) {
  const output = autoencoder.predict(x_test);
  // output.print();

  const newImages = await output.array();
  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    const buffer = [];
    for (let n = 0; n < img.length; n++) {      
      const val =Math.floor(img[n] * 255);
      buffer[n * 4 + 0] = val;
      buffer[n * 4 + 1] = val;
      buffer[n * 4 + 2] = val;
      buffer[n * 4 + 3] = 255;
    }
    const image = new Jimp(
      {
        data: Buffer.from(buffer),
        width: W,
        height: W,
      },
      (err, image) => {
        const num = numeral(i).format("0000");
        image.write(`output/square${num}.png`);
      }
    );
  }
}

function createDecoder(decoderLayers) {
  const decoder = tf.sequential();
  for (let layer of decoderLayers) {
    const newLayer = tf.layers.dense({
      units: layer.units,
      activation: layer.activation,
      inputShape: [layer.kernel.shape[0]],
    });
    console.log(layer.kernel.shape);
    decoder.add(newLayer);
    newLayer.setWeights(layer.getWeights());
  }
  // const learningRate = 0.000001;
  // const optimizer = tf.train.adam(learningRate);
  decoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return decoder;
}

function buildModel() {
  const autoencoder = tf.sequential();
  // Build the model

  // Encoder
  autoencoder.add(
    tf.layers.dense({
      units: 256,
      inputShape: [W * W],
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 128,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 2,
      activation: "relu",
    })
  );
  // How do I start from here?
  // Decoder

  let decoderLayers = [];
  decoderLayers.push(
    tf.layers.dense({
      units: 16,
      activation: "relu",      
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 128,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 256,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: W * W,
      activation: "relu",
    })
  );

  for (let layer of decoderLayers) {
    autoencoder.add(layer);
  }

  // const learningRate = 0.001;
  // const optimizer = tf.train.adam(learningRate);
  autoencoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return { decoderLayers, autoencoder };
}

async function trainModel(autoencoder, x_train, epochs) {
  await autoencoder.fit(x_train, x_train, {
    epochs: epochs,
    batch_size: 32,
    shuffle: true,
    verbose: true,
  });
}

async function loadImages(total) {
  const allImages = [];
  for (let i = 0; i < total; i++) {
    const num = numeral(i).format("0000");
    const img = await Jimp.read(
      `training-data/data/image_${num}.png`
    );

    let rawData = [];
    for (let n = 0; n < W * W; n++) {
      let index = n * 4;
      let r = img.bitmap.data[index + 0];
      // let g = img.bitmap.data[n + 1];
      // let b = img.bitmap.data[n + 2];
      rawData[n] = r / 255.0;
    }
    allImages[i] = rawData;
  }
  return allImages;
}
