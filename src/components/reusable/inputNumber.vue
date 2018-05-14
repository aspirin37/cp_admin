<template>
   <div class="input-group input-group--number">
      <span class="input-group-btn print-no">
        <button class="btn btn-sm btn-icon btn-round btn-success" @click.prevent="decreaseNumber" :class="buttonClass" :disabled="disabled">-</button>
      </span>
      <input
        type="number"
        v-bind:value="numericValue"
        @keypress="validateInput"
        :class="inputClass"
        :min="min"
        :max="max"
        debounce="500"
        class="form-control form-control-sm"
        :disabled="disabled"
      />
      <span class="input-group-btn print-no">
        <button class="btn btn-sm btn-icon btn-round btn-success" @click.prevent="increaseNumber" :class="buttonClass" :disabled="disabled">+</button>
      </span>
    </div>
</template>

<script>
export default {
    name: 'NumberInputSpinner',

    data: function () {
        return {
            numericValue: this.value,
        };
    },

    props: {
        value: {
          type: Number,
          default: 0
        },
        min: {
            default: 0,
            type: Number
        },
        max: {
            default: 10,
            type: Number
        },
        step: {
          default: 1,
          type: Number
        },
        inputClass: {
          default: 'inputNum_btn',
          type: String
        },
        buttonClass: {
          default: 'inputNum_input',
          type: String
        },
        integerOnly: {
          default: false,
          type: Boolean
        },
        disabled: {
          dafault: false,
          type: Boolean
        }
    },

    methods: {
        increaseNumber() { this.numericValue += this.step; },

        decreaseNumber() { this.numericValue -= this.step; },

        isInteger(evt) {
            evt = (evt) ? evt : window.event;
            let key = evt.keyCode || evt.which;
            key = String.fromCharCode( key );
            const regex = /[0-9]/;

            if( !regex.test(key) ) {
                evt.returnValue = false;
                if(evt.preventDefault) evt.preventDefault();
            }
        },

        isNumber(evt) {
           evt = (evt) ? evt : window.event;
           var charCode = (evt.which) ? evt.which : evt.keyCode;

           if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
               evt.preventDefault();
           }
           else {
               return true;
           }
       },

       validateInput(evt) {
          if ( this.integerOnly === true) {
            this.isInteger(evt);
          }
          else {
              this.isNumber(evt);
          }
       }
    },

    watch: {
        numericValue: function(val, oldVal){
            if( val <= this.min ) { this.numericValue = parseInt(this.min); }

            if( val >= this.max ) { this.numericValue = parseInt(this.max); }

            if( val <= this.max && val >= this.min ) {
                this.$emit('input', val, oldVal );
            }
        }
    }
};
</script>

<style scoped lang="sass">
  .input-group
    width: 60%

  input[type=number] 
    min-width: 42px
    max-width: 
    text-align: center 
    border-left: 0 none 
    border-right: 0 none 
    -moz-appearance: none
    -webkit-appearance: none

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button 
      -webkit-appearance: none
      margin: 0

  button[disabled] 
    cursor: no-drop

  .input-group-btn:not(:last-child)>.btn 
    margin-right: 0

  // .input-group--number
  //   max-width: 110px
</style>