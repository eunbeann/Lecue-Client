import { api } from '../../libs/api';

const getLecueBook = async () => {
  const { data } = await api.get('/api/common/home');
  return data;
};

export default getLecueBook;
