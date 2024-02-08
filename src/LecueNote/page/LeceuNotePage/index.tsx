import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../../../components/common/Header';
import LoadingPage from '../../../components/common/LoadingPage';
import CommonModal from '../../../components/common/Modal/CommonModal';
import Footer from '../../components/Footer';
import SelectColor from '../../components/SelectColor';
import WriteNote from '../../components/WriteNote';
import {
  BG_COLOR_CHART,
  CATEGORY,
  TEXT_COLOR_CHART,
} from '../../constants/colorChart';
import usePostLecueNote from '../../hooks/usePostLecueNote';
import usePutPresignedUrl from '../../hooks/usePutPresignedUrl';
import * as S from './LecueNotePage.style';

function LecueNotePage() {
  const MAX_LENGTH = 1000;
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId } = location.state || {};

  const [contents, setContents] = useState('');
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [fileName, setFileName] = useState(BG_COLOR_CHART[0]);
  const [presignedUrl, setPresignedUrl] = useState('');
  const [file, setFile] = useState<File>();
  const [modalOn, setModalOn] = useState(false);
  const [escapeModal, setEscapeModal] = useState(false);

  const [rawImgFile, setRawImgFile] = useState({
    imgStr: '',
    imgBinary: new FileReader(),
  });
  const { imgStr, imgBinary } = rawImgFile;
  
  const [clickedData, setClickedData] = useState({
    category: CATEGORY[0],
    textColor: TEXT_COLOR_CHART[0],
    background: BG_COLOR_CHART[0],
  });
  const { category, textColor, background } = clickedData;

  const putMutation = usePutPresignedUrl();
  const postMutation = usePostLecueNote();

  const handleClickCategory = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setClickedData({
      ...clickedData,
      [e.currentTarget.name]: e.currentTarget.innerHTML,
    });
  };

  const handleChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContents(e.target.value);
    if (e.target.value.length > MAX_LENGTH) {
      setContents((e.target.value = e.target.value.substring(0, MAX_LENGTH)));
      alert('1000자 내로 작성해주세요.');
    }
  };

  const handleClickedColorBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setClickedData({
      ...clickedData,
      [e.currentTarget.name]: e.currentTarget.id,
    });

    category !== '텍스트색' && setIsIconClicked(false);
  };

  const handleClickedIcon = () => {
    setIsIconClicked(true);
  };

  const handleTrainsitImgFile = (file: string | FileReader) => {
    if (typeof file === 'string') {
      // prev를 활용해서 이전 값을 기반으로 상태 업데이트
      setRawImgFile((prev) => ({ ...prev, ['imgStr']: file }));
    } else {
      setRawImgFile((prev) => ({ ...prev, ['imgBinary']: file }));
    }
  };

  const handleClickCompleteModal = async () => {
    if (imgBinary) {
      if (imgBinary.result && file) {
        putMutation.mutate({
          presignedUrl: presignedUrl,
          binaryFile: imgBinary.result,
          fileType: file.type,
        });
      }
    }
    postMutation.mutate({
      contents: contents,
      color: textColor,
      fileName: fileName,
      bgColor: background,
      isIconClicked: isIconClicked,
      bookId: bookId,
    });
  };

  return putMutation.isLoading || postMutation.isLoading ? (
    <LoadingPage />
  ) : (
    <S.Wrapper>
      {modalOn && (
        <CommonModal
          handleFn={handleClickCompleteModal}
          category="note_complete"
          setModalOn={setModalOn}
        />
      )}

      {escapeModal && (
        <CommonModal
          handleFn={() => navigate(-1)}
          category="note_escape"
          setModalOn={setEscapeModal}
        />
      )}
      <Header
        headerTitle="레큐노트 작성"
        handleFn={() => setEscapeModal(true)}
      />

      <S.CreateNote>
        <WriteNote
          imgFile={imgStr}
          isIconClicked={isIconClicked}
          clickedData={clickedData}
          contents={contents}
          handleChangeFn={handleChangeContents}
        />
        <SelectColor
          isIconClicked={isIconClicked}
          clickedData={clickedData}
          setFileName={setFileName}
          handleCategoryFn={handleClickCategory}
          handleColorFn={handleClickedColorBtn}
          handleIconFn={handleClickedIcon}
          handleTrainsitImgFile={(imgFile) => handleTrainsitImgFile(imgFile)}
          setPresignedUrl={setPresignedUrl}
          selectedFile={(file) => setFile(file)}
        />
      </S.CreateNote>

      <Footer contents={contents} setModalOn={setModalOn} />
    </S.Wrapper>
  );
}

export default LecueNotePage;
