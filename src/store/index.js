import Vue from 'vue';
import Vuex from 'vuex';

// Importing constants
import * as actions from "./actions";
import * as mutations from "./mutation-types";

// Importing helper tools
import { getNetIdString } from "@/utils/HelperTools";
import { BucketHelper } from "!awesome-typescript-loader!../utils/HelperTextile.ts";
const bucketHelper = new BucketHelper();
// Importing contract ABIs
import LimeFactoryABI from "../../build/LimeFactory.json";

import { BNavbar, BNavbarNav, BNavbarBrand } from 'bootstrap-vue'
Vue.component('b-navbar', BNavbar);
Vue.component('b-navbar-brand', BNavbarBrand);
Vue.component('b-navbar-nav', BNavbarNav);

// Setting Vue up to use Vuex
Vue.use(Vuex)

// The global state of the application
export default new Vuex.Store({
  state: {
    keyInfo: {
      key: 'bo3mpfn54vhvovwbljxx5kqkbzq',
      secret: '',
      type: 1, 
    },
    connected: false,
    ethers: null,
    provider: null,
    signer: null,
    userAddress: null,
    currentNetwork: null,
    daiAddress: null,
    userDaiBalance: null,
    limeFactory: null,
    identity: null,
    libp2pIdentity: null,
    buckets: null,
    bucketKey: null
  },
  /**
     * mutations can only edit one state at a time. If multiple state changes
     * are done in the same mutation only the first one will execute.
     */
  mutations: {
    [mutations.SET_USER_IDENTITY](state, identity) {
      console.log("identity set to: ");
      state.identity = identity;
      console.log(state.identity);
    },
    [mutations.SET_USER_LIBP2P_IDENTITY](state, libp2pId) {
      console.log("identity set to: ");
      state.libp2pIdentity = libp2pId;
      console.log(state.libp2pIdentity);
    },
    [mutations.SET_BUCKET](state, buckets) {
      console.log("buckets set to: ");
      state.buckets = buckets;
      console.log(state.buckets);
    },
    [mutations.SET_BUCKET_KEY](state, bucketKey) {
      console.log("bucket key set to: ");
      state.bucketKey = bucketKey;
      console.log(state.bucketKey);
    },
    [mutations.SET_SIGNER](state, signer) {
      console.log("signer set to: ");
      state.signer = signer;
      console.log(state.signer);
    },
    [mutations.SET_USER_ADDRESS](state, address) {
      state.userAddress = address;
      console.log("user address set to:")
      console.log(state.userAddress)
    },
    [mutations.SET_CURRENT_NETWORK](state, network) {
      state.currentNetwork = network;
      console.log("network set to: " + state.currentNetwork);
    },
    [mutations.SET_ETHERS](state, ethers) {
      state.ethers = ethers;
      console.log("ethers set to: ");
      console.log(state.ethers);
    },
    [mutations.SET_PROVIDER](state, provider) {
      state.provider = provider;
      console.log("provider set to: ");
      console.log(state.provider);
    },
    [mutations.SET_USER_DAI_BALANCE](state, balance) {
      state.userDaiBalance = balance;
      console.log("user dai balance set to: ");
      console.log(state.userDaiBalance);
    },
    [mutations.SET_DAI_ADDRESS](state, address) {
      state.daiAddress = address;
      console.log("dai address set to: ");
      console.log(state.daiAddress);
    },
    [mutations.SET_LIME_FACTORY](state, instance) {
      state.limeFactory = instance;
      console.log("contract instance set to: ");
      console.log(state.limeFactory);
    }
  },
  /**
   * Actions can only take in one parameter. If multiple need to be sent they
   * need to be formatted into an object and sent through as one object
   */
  actions: {
    [actions.SET_UP_INFO]: async function({commit, state}, provider) {
      let network = await getNetIdString(provider);
      let signer = await provider.getSigner();
      let address = await signer.getAddress();

      // Committing to state
      commit(mutations.SET_PROVIDER, provider);
      commit(mutations.SET_CURRENT_NETWORK, network);
      commit(mutations.SET_SIGNER, signer);
      commit(mutations.SET_USER_ADDRESS, address);
      window.ethereum.enable();

      let limeFactory = new state.ethers.Contract(
        "0x9eD274314f0fB37837346C425D3cF28d89ca9599",
        LimeFactoryABI.abi,
        state.signer 
      );
      /**
       * By passing in the signer to the contract instead of the provider, the
       * contract will be set up in context of the user, meaning you will not
       * have to add the users address to each transaction, as they are set
       * as the provider so it will be coming from them in all txs.
       */
      commit(mutations.SET_LIME_FACTORY, limeFactory);
    },
    [actions.SET_ETHERS]: function({commit}, ethers) {
      commit(mutations.SET_ETHERS, ethers);
    },
    [actions.INTERACT_CONTRACT]: async function({commit, state}, params) {
      console.log(params);
      /**
       * actions can only take in one parameter. This is an example of an
       * action that needed to take in multiple. See LandingPage.vue for the
       * calling/set up of the parameters
       */
      let tx = await state.limeFactory.createLime(
        params.name,
        params.carbs,
        params.fat,
        params.protein,
      );
      console.log("done")

      /**
       * This is a very janky way to get the events and it gives them to you
       * encoded. I am sure there is a better way to do this but for now its fine
       */
      let topic = state.ethers.utils.id("FreshLime(uint8)");
      let blockNumber = await state.provider.getBlockNumber();

      let filter = {
        address: "0x9eD274314f0fB37837346C425D3cF28d89ca9599",
        fromBlock: blockNumber - 100,
        toBlock: blockNumber,
        topics: [ topic ]
      };

      let results = await state.provider.getLogs(filter);
      // The emitted event data will be under [index].data
      console.log(results);
    },
    [actions.GET_IDENTITY]: async function({commit}) {
      const id = await bucketHelper.getIdentity(null);

      commit(mutations.SET_USER_LIBP2P_IDENTITY, id[0]);
      commit(mutations.SET_USER_IDENTITY, id[1]);
      
    },
    [actions.GET_BUCKETS]: async function ({commit, state}) {
      const bucketsInfo = await bucketHelper.getBucketKey(
        state.libp2pIdentity,
        state.keyInfo.key,
        state.keyInfo.secret,
        state.keyInfo.type,
      );

      commit(mutations.SET_BUCKET, bucketsInfo[0]);
      commit(mutations.SET_BUCKET_KEY, bucketsInfo[1]);
    },
    [actions.GET_BUCKET_LINK]: async function ({commit, state}) { 
      console.log(state.buckets);
      console.log(state.bucketKey);
      const links = await bucketHelper.getBucketLinks(
        state.buckets,
        state.bucketKey
      );
      console.log("here");
      console.log(links);
    },
  }
});
