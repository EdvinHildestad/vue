// Vue Hello World Component
const HelloWorld = {
    props: ['message'],
    template: `
        <div class="hello-world">
            <h2>Hello World Component</h2>
            <p>{{ message }}</p>
            <p>This is a simple Vue.js static application!</p>
        </div>
    `
};

// Main Vue Application
const { createApp } = Vue;

createApp({
    components: {
        HelloWorld
    },
    data() {
        return {
            title: 'Welcome to Vue.js',
            message: 'Hello from Vue component!',
            count: 0,
            newTodo: '',
            todos: [
                { text: 'Learn Vue.js', completed: false },
                { text: 'Build a static app', completed: true },
                { text: 'Deploy to production', completed: false }
            ]
        };
    },
    methods: {
        increment() {
            this.count++;
        },
        decrement() {
            this.count--;
        },
        reset() {
            this.count = 0;
        },
        addTodo() {
            if (this.newTodo.trim()) {
                this.todos.push({
                    text: this.newTodo.trim(),
                    completed: false
                });
                this.newTodo = '';
            }
        },
        removeTodo(index) {
            this.todos.splice(index, 1);
        },
        toggleTodo(index) {
            this.todos[index].completed = !this.todos[index].completed;
        }
    },
    computed: {
        completedTodos() {
            return this.todos.filter(todo => todo.completed).length;
        },
        totalTodos() {
            return this.todos.length;
        }
    },
    mounted() {
        console.log('Vue app mounted successfully!');
        console.log(`Total todos: ${this.totalTodos}, Completed: ${this.completedTodos}`);
    }
}).mount('#app');