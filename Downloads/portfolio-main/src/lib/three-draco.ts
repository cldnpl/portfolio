import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

let sharedDracoLoader: DRACOLoader | null = null;

export const createGltfLoader = () => {
  const loader = new GLTFLoader();

  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderPath(DRACO_DECODER_PATH);
  }

  loader.setDRACOLoader(sharedDracoLoader);
  return loader;
};
