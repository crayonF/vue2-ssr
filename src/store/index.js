import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'

Vue.use(Vuex)
export function createStore () {
    return new Vuex.Store({
        namespaced: true,
        modules: {
            user
        }
    })
}
