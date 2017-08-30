<template>
 <div class="marginal">
   <div class="row text-left">
    <div class="col-12 text-left">
      <p class="text-center group">
          <q-btn
            v-if="canGoBack"
            color="teal"
            push
            @click="goBack"
            icon="keyboard_arrow_left"
          >
            Back
          </q-btn>
        </p>
    </div> 
  </div>
  <div class="row md-gutter justify-center items-center marginal">
    <div class="col-xs-12 col-sm-12 col-md-12">
        <p class="uppercase text-center">Please select a registration type to begin</p>
    </div>
    <template v-for="(reg, index) in registrationTypes">
      <div class="col-xs-12 col-sm-6 col-md-4" :key="index">
        <ul class="price">
          <li v-if="reg.name === 'trial'" class="header">{{ reg.label }}</li>
          <li v-if="reg.name === 'basic'" class="header-3">{{ reg.label }}</li>
          <li v-if="reg.name === 'premium'" class="header-2">{{ reg.label }}</li>

          <li v-if="reg.name === 'trial'" class="grey">Free</li>
          <li v-if="reg.name === 'basic'" class="grey">&#8358; 250.00</li>
          <li v-if="reg.name === 'premium'" class="grey">&#8358; 300.00</li>
          
          <li>{{ reg.form.students }}</li>
          <li>{{ reg.form.teachers }}</li>
          <li>{{ reg.form.admins }}</li>
          <li>{{ reg.form.terms }}</li>
          <li v-if="reg.form.modules"><small>{{ reg.form.modules }}</small></li>
          <li class="grey">
            <router-link :to="{ name: 'Registration', params: { type: reg.name }}">
              <small class="button">Sign Up</small>
            </router-link>
            
          </li>
        </ul>
      </div>
    </template>
  </div>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain,
  QCardSeparator, QCardActions, QBtn, QListHeader,
  QItemSide, QItem, QItemMain, QChip, QSideLink } from 'quasar'
export default {
  data () {
    return {
      canGoBack: window.history.length > 1,
      registrationTypes: [
        {
          name: 'trial',
          label: 'Trial',
          form: {
            headerClass: 'header',
            students: '10 Students',
            teachers: 'Unlimited Teachers',
            admins: 'Single Administrator',
            terms: 'One Academic term',
            modules: 'Academics'
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
            terms: 'Three Academic terms',
            modules: 'Academics, Finance & HR'
          }
        },
        {
          name: 'premium',
          label: 'Premium',
          form: {
            headerClass: 'header-2',
            students: 'Unlimited Students',
            teachers: 'Unlimited Teachers',
            admins: 'Unlimited Administrators',
            terms: 'Three Academic terms',
            modules: 'Academics, Finance, HR, Library, Hostel & more'
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
    QSideLink,
    QChip
  },
  methods: {
    startRegistration (data) {
      console.log('Type: ' + data)
      this.$router.push('/registration/' + data)
    },
    goBack () {
      // this.$router.push('/dashboard')
      window.history.go(-1)
    }
  }
}
</script>
<style>
* {
  box-sizing: border-box;
}

.marginal {
  margin-left: 5%;
  margin-right: 7%;
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
