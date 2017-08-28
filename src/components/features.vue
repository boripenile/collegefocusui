<template>
  <div class="row md-gutter justify-center items-center marginal">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <blockquote class="text-center">
        <p class="uppercase">Please select a registration type to begin</p>
      </blockquote>
    </div>
    <template v-for="(reg, index) in registrationTypes">
      <div class="col-xs-12 col-sm-4 col-md-4" :key="index">
        <ul class="price">
          <li v-if="reg.name === 'trial'" class="header">{{ reg.label }}</li>
          <li v-if="reg.name === 'premium'" class="header-2">{{ reg.label }}</li>
          <li v-if="reg.name === 'basic'" class="header-3">{{ reg.label }}</li>

          <li v-if="reg.name === 'trial'" class="grey">&#8358; 0.00</li>
          <li v-if="reg.name === 'premium'" class="gray">&#8358; 300.00</li>
          <li v-if="reg.name === 'basic'" class="grey">&#8358; 250.00</li>

          <li>{{ reg.form.students }}</li>
          <li>{{ reg.form.teachers }}</li>
          <li>{{ reg.form.admins }}</li>
          <li>{{ reg.form.terms }}</li>
          <li v-if="reg.form.modules">{{ reg.form.modules }}</li>
          <li class="grey">
            <router-link :to="{ name: 'Registration', params: { type: reg.name }}">
              <q-btn class="button">Sign Up</q-btn>
            </router-link>
            
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain,
  QCardSeparator, QCardActions, QBtn, QListHeader,
  QItemSide, QItem, QItemMain, QChip } from 'quasar'
export default {
  data () {
    return {
      registrationTypes: [
        {
          name: 'trial',
          label: 'Trial',
          form: {
            headerClass: 'header',
            students: '10 Students',
            teachers: 'Unlimited Teachers',
            admins: 'Unlimited Administrators',
            terms: 'One Academic term'
          }
        },
        {
          name: 'premium',
          label: 'Advance',
          form: {
            headerClass: 'header-2',
            students: 'Unlimited Students',
            teachers: 'Unlimited Teachers',
            admins: 'Unlimited Administrators',
            terms: 'Three Academic term',
            modules: 'All Modules'
          }
        },
        {
          name: 'basic',
          label: 'Basic',
          form: {
            headerClass: 'header-3',
            price: '&#8358; 250.00',
            students: 'Unlimited Students',
            teachers: 'Unlimited Teachers',
            admins: 'Unlimited Administrators',
            terms: 'Three Academic term'
          }
        }
      ]
    }
  },
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QBtn,
    QListHeader,
    QItemSide,
    QItem,
    QItemMain,
    QChip
  },
  methods: {
    startRegistration (data) {
      console.log('Type: ' + data)
      this.$router.push('/registration/' + data)
    }
  }
}
</script>
<style>
* {
  box-sizing: border-box;
}

.marginal {
  margin: 3%;
}
/* Create three columns of equal width */
.columns {
    float: left;
    width: 25%;
    padding: 8px;
}

/* Style the list */
.price {
    list-style-type: none;
    border: 1px solid #eee;
    margin: 0;
    padding: 0;
    -webkit-transition: 0.3s;
    transition: 0.3s;
}

/* Add shadows on hover */
.price:hover {
    box-shadow: 0 8px 12px 0 rgba(0,0,0,0.2)
}

/* Pricing header */
.price .header {
    background-color: #C10130;
    color: white;
    font-size: 25px;
}

.price .header-2 {
    background-color: #703F80;
    color: white;
    font-size: 25px;
}
.price .header-3 {
    background-color: #F14B30;
    color: white;
    font-size: 25px;
}
/* List items */
.price li {
    border-bottom: 1px solid #eee;
    padding: 20px;
    text-align: center;
}

/* Grey list item */
.price .grey {
    background-color: #eee;
    font-size: 20px;
}

/* The "Sign Up" button */
.button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 25px;
    text-align: center;
    text-decoration: none;
    font-size: 18px;
}

/* Change the width of the three columns to 100% 
(to stack horizontally on small screens) */
@media only screen and (max-width: 600px) {
    .columns {
        width: 100%;
    }
}
</style>
