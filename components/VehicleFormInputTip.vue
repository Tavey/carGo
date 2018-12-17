<template>
  <el-select
      v-model="location"
      filterable
      remote
      size="mini"
      :remote-method="autoCompleteSearch"
      :placeholder="placeholder"
      :clearable="true"
      @change="updateAddress"
  >
      <el-option 
          v-for="(item, index) in completeArr"
          :key="item.id"
          :value="index"
          :label="item.name"
      >
        <div class="address-box">
            <span class="address-name">{{item.name}}</span>
            <span class="address-district">{{item.district}}</span>
        </div>
      </el-option>
  </el-select>
</template>
<script>
export default {
    data() {
        return {
            completeArr: [],
            location: ""
        };
    },
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            required: true
        }
    },
    methods: {
        autoCompleteSearch(keyWord) {
            this.$Api.mapAutoComplete(keyWord).then((res) => {
                if (res.data.info === "OK") {
                    this.completeArr = res.data.tips.filter(a => {
                        return a.location.length > 0;
                    });
                }
            });
        },
        updateAddress(val) {
            if (val === '') return;
            this.$emit("set-address", this.type, this.completeArr[val]);
            this.completeArr = [];
            this.$emit('clear');
        },
        clear() {
            this.location = "";
        },
    }
};
</script>
<style scoped lang="scss">
$fontSize: 10px;

.address-name,
.address-district {
    font-size: $fontSize;
}
.address-box {
    display: flex;
    justify-content: space-between;
}
.address-district {
    color: #9999;
}
</style>
