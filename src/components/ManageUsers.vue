<template>
    <div class="row justify-content-center" style="margin: 20px auto">
        <div class = "col-10">
            <div class="row justify-content-between" style="margin-bottom: 10px">
                <div class="col-6">
                    <h2>Zarządzaj użytkownikami</h2>
                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Login</th>
                    <th scope="col">Nazwa</th>
                    <th scope="col">Status</th>
                    <th scope="col">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in users" :key="item.key">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ item.username }}</td>
                        <td>{{ item.fullname }}</td>
                        <td>
                            <form action="#">
                                <select v-model="item.admin" @change="updateUser(index)">
                                    <option :value="true">Admin</option>
                                    <option :value="false">User</option>
                                </select>
                            </form>
                        </td>
                        <td>
                            <a href="#" @click="remove(index)">Usuń</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            users: []
        }
    },
    created: function() {
        axios.get('/users')
        .then(res => {
            this.users = res.data;
        })
        .catch(e => {
            console.log(e);
        });
    },
    methods: {
        remove: function(index) {
            var username = this.users[index].username;
            axios.get('/users/remove/' + username)
            .then(() => {
                this.users.splice(index, 1);
            })
            .catch(e => {
                console.log(e);
            });
        },
        updateUser: function(index) {
            var username = this.users[index].username;
            axios.post('/users/edit/' + username, {
                data: this.users[index]
            })
            .catch(e => {
                this.users[index].admin = !this.users[index].admin;
            });
        }
    }
}
</script>