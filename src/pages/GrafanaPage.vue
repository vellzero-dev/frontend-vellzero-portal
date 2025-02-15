<template>
  <q-page class="q-pa-md">
    <!-- 왼쪽 정렬된 탭 영역 -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-white shadow-2 rounded-borders"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="test" label="Test" />
      <q-tab name="rc" label="RC" />
      <q-tab name="live" label="Live" />
    </q-tabs>

    <!-- + 버튼을 클릭하여 데이터 추가 (테이블 바로 위에 위치) -->
    <div class="q-mt-md" style="text-align: right">
      <q-btn label="+" @click="toggleDrawer" color="primary" style="width: 60px" size="sm" />
    </div>

    <!-- 데이터 추가 폼 (다이얼로그) -->
    <AddDataDialog
      :dialogVisible="dialogVisible"
      @update:dialogVisible="dialogVisible = $event"
      :fetchData="fetchData"
    />

    <!-- 탭 내용 영역 -->
    <div v-if="tab === 'test'">
      <q-table :rows="testData" :columns="columns" row-key="id" class="q-mt-md">
        <template v-slot:body-cell-monitor="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.grafana_url"
              icon="visibility"
              color="primary"
              @click="openGrafanaUrl(props.row.grafana_url)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div v-if="tab === 'rc'">
      <q-table :rows="rcData" :columns="columns" row-key="id" class="q-mt-md" />
    </div>
    <div v-if="tab === 'live'">
      <q-table :rows="liveData" :columns="columns" row-key="id" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AddDataDialog from './grafana/AddDataDialog.vue';  // AddDataDialog 컴포넌트 임포트

// 활성화된 탭을 제어하는 변수
const tab = ref('test');

const dialogVisible = ref(false);

// 테이블의 열(4개의 필드)
const columns = [
  { name: 'name', label: '이름', align: 'left', field: (row) => row.name, style: 'width: 20%;' },
  { name: 'content', label: '내용', align: 'left', field: (row) => row.content, style: 'width: 50%;' },
  { name: 'created_at', label: '생성 날짜', align: 'left', field: (row) => row.created_at, style: 'width: 30%;' },
  { name: 'monitor', label: 'Grafana', align: 'center', field: 'monitor', style: 'width: 10%;' }
];

// 탭에 맞는 데이터
const testData = ref([]);
const rcData = ref([]);
const liveData = ref([]);

// 데이터 가져오기 함수
const fetchData = async () => {
  try {
    //const response = await axios.get('http://fastapi.jy913.xyz:31779/data');
    const response = await axios.get('http://127.0.0.1:8000/data');
    const allData = response.data;
    testData.value = allData;
  } catch (error) {
    console.error('데이터를 가져오는 중 에러가 발생했습니다:', error);
  }
};

// Grafana URL을 새 탭으로 열기
const openGrafanaUrl = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

// 컴포넌트가 마운트되면 데이터 가져오기
onMounted(fetchData);

// 다이얼로그 표시
const toggleDrawer = () => {
  dialogVisible.value = true;
};
</script>

<style scoped>
/* 스타일 정의 */
.q-table {
  max-width: 100%;
  overflow-x: auto;
}

.q-tabs {
  justify-content: flex-start;
}

.q-input[type='textarea'] {
  width: 100%;
  height: 80px;
}
</style>
