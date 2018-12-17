<template>
  <div class="info-window">
      <p class="bold-para">
          {{car.plate_num}}
      </p>
      <p>
          车速: {{car.speed}}公里/小时
      </p>
      <p class="line"></p>
      <p class="bold-para">
          <span v-if="address.province&&address.district">{{address.province}}-{{address.district}}</span>
          <span v-else>暂无地址</span>
         
      </p>
      <p>
          {{address.street}}
      </p>
      <p>
          更新时间: {{car.sampled_at}}
      </p>
      <span class="trangle">
          
      </span>
  </div>
</template>
<script>
import GPS from "@/plugins/gps";
export default {
    data() {
        return {
            address: {
                province: "暂无",
                district: "暂无",
                street: "暂无"
            }
        };
    },
    props: {
        car: {
            type: Object
        }
    },
    watch: {
        car: {
            handler: function(val) {
                if (val.latitude && val.longitude) {
                    this.handleWindowInfo(val);
                }
            },
            immediate: true
        }
    },
    methods: {
        async handleWindowInfo(car) {
            let vm = this;
            try {
                let res = await vm.$DB.Get(`${car.latitude}, ${car.longitude}`);
                if (!res) {
                    let { data } = await vm.$Api.geoCode(
                        car.longitude,
                        car.latitude
                    );
                    let {
                        province,
                        district
                    } = data.regeocode.addressComponent;

                    let street =  data.regeocode.formatted_address.split(
                          district
                      )[1];

                    let address = data.regeocode.formatted_address;

                    vm.$DB.Add({
                        latlng: `${car.latitude}, ${car.longitude}`,
                        province,
                        district,
                        street,
                        address
                    });

                    vm.address = {
                        province,
                        district,
                        street
                    };
                } else {
                    let { province, district, street } = res;
                    vm.address = {
                        province,
                        district,
                        street
                    };
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.info-window {
    background-color: #fff;
    min-height: 100px;
    min-width: 200px;
    font-size: 12px;
    padding: 10px;
    position: relative;
    & > p {
        margin: 5px 0;
        padding: 0;
    }

    & > p.line {
        width: 100%;
        height: 1px;
        margin: 8px 0;
        background-color: #efefef;
    }
    &:after {
        content: "";
    }
}
.bold-para {
    font-weight: 700;
}

.trangle {
    border-top: 10px solid #fff;
    left: 46%;
    bottom: -9px;
    display: block;
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
}
</style>
