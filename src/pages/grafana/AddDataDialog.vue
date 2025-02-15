<template>
  <q-dialog v-model="localDialogVisible">
    <q-card style="max-width: 800px; width: 100%">
      <q-card-section>
        <div class="q-mb-md">
          <q-input v-model="newRow.name" label="이름" />
          <q-input v-model="newRow.content" label="내용" type="textarea" />
          <q-input v-model="newRow.grafana_url" label="Grafana URL" />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn label="저장" @click="addData" color="primary" />
        <q-btn label="취소" @click="closeDialog" color="secondary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

// 부모에서 전달된 props
const props = defineProps({
  dialogVisible: Boolean,
  fetchData: Function,
});

const emit = defineEmits(['update:dialogVisible']); // dialogVisible을 업데이트 하기 위한 emit

// 내부 상태로 v-model을 사용하기 위해 새로운 변수를 선언
const localDialogVisible = ref(props.dialogVisible);

watch(() => props.dialogVisible, (newVal) => {
  localDialogVisible.value = newVal;
});

watch(localDialogVisible, (newVal) => {
  emit('update:dialogVisible', newVal);
});

const newRow = ref({
  name: '',
  content: '',
  grafana_url: '',
});

const addData = async () => {
  try {
    const currentTime = new Date().toISOString();

    const newData = {
      name: newRow.value.name,
      content: newRow.value.content,
      grafana_url: newRow.value.grafana_url,
      created_at: currentTime,
    };

    //await axios.post('http://fastapi.jy913.xyz:31779/data', newData);
    await axios.post('http://localhost:8000/data', newData);

    await props.fetchData(); // 부모로부터 받은 fetchData 메서드 호출

    // 다이얼로그 닫기 및 폼 초기화
    emit('update:dialogVisible', false);
    newRow.value = { name: '', content: '', grafana_url: '' };
  } catch (error) {
    console.error('데이터 추가 중 오류가 발생했습니다:', error.response || error);
  }
};

const closeDialog = () => {
  emit('update:dialogVisible', false);
};
</script>

<style scoped>
.q-input[type='textarea'] {
  width: 100%;
  height: 80px;
}
</style>
