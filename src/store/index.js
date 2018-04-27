import vue from 'vue'
import vuex from 'vuex'
import router from '../router'
import firebase from 'firebase'
import db from '../utils/firebaseInit'

vue.use(vuex)

let store = new vuex.Store({
    state: {
        user: {},
        boards: [],
        activeBoard: {},
        posts: [],
        replies: {},
        loading: true
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setBoards(state, payload) {
            state.boards = payload
            state.loading = false
        },
        setPosts(state, payload) {
            state.posts = payload
        },

        //try passing board,  =board
        setActiveBoard(state, payload) {
            state.activeBoard = payload
        },
    },
    actions: {
        getBoards({ commit, dispatch }) {
            db.collection('boards').get().then(querySnapshot => {
                var boards = []
                querySnapshot.forEach(doc => {
                    let board = doc.data()
                    board.id = doc.id

                    board.posts = []
                    db.collection('boards').doc(board.id).collection('posts').get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            let post = doc.data()
                            post.id = doc.id
                            board.posts.push(post)
                        })
                    })
                    boards.push(board)
                })
                commit('setBoards', boards)
            })
        },
        getBoard({ commit, dispatch }, boardId) {
            db.collection('boards').doc(boardId).get().then(doc => {
                if (doc.exists) {
                    var board = doc.data()
                    board.id = doc.id
                    board.posts = []
                    db.collection('boards').doc(board.id).collection('posts').get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            let post = doc.data()
                            post.id = doc.id
                            board.posts.push(post)
                        })
                    })
                    commit('setActiveBoard', board)
                    router.push('/boards/' + board.id)
                }
                else {
                    console.log("No such document")
                }
            })
        },
        deleteBoard({ commit, dispatch }, boardId) {
            db.collection('boards').doc(boardId).delete().then(() => {
                dispatch('getBoards')
            })
        },
        addBoard({ commit, dispatch }, payload) {
            payload.userId = firebase.auth().currentUser.uid
            db.collection('boards').add(payload)
                .then(function (docRef) {
                    console.log('Document written with ID: ', docRef.id)
                    dispatch('getBoards')
                })
                .catch(function (error) {
                    console.error('Error adding document: ', error)
                })
        },
        getPosts({ commit, dispatch }, boardId) {
            db.collection('posts').where("boardId", "==", boardId).get()
                .then(querySnapshot => {
                    var posts = []
                    querySnapshot.forEach(doc => {
                        let data = doc.data()
                        data.id = doc.id
                        posts.push(data)
                    })
                    commit('setPosts', posts)
                })
        },
        addPost({ commit, dispatch }, payload) {
            db.collection('boards').doc(payload.boardId).collection('posts').add(payload.post)
                .then(docRef => {
                    dispatch('getBoards', payload.boardId)
                    console.log('Document written with ID: ', docRef.id)
                })
                .catch(function (error) {
                    console.error('Error adding document: ', error)
                })
        },
        register({ commit, dispatch }, payload) {

            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(res => {
                    commit('setUser', firebase.auth().currentUser)
                    router.push('/')
                })
                .catch(err => {
                    console.error(err)
                })
        },
        login({ commit, dispatch }, payload) {
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
                .then(res => {
                    commit('setUser', firebase.auth().currentUser)
                    router.push('/')
                })
                .catch(err => {
                    console.error(err)
                })
        },
        authenticate({ commit, dispatch }) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    commit('setUser', user)
                    router.push('/')
                } else {
                    commit('setUser', {})
                    router.push('login')
                }
            })
        },
        logout({ commit, dispatch }) {
            firebase.auth().signOut()
                .then(res => {
                    commit('setUser', {})
                    router.push('login')
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
})

export default store