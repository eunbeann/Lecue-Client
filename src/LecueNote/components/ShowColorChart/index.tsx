import { useRef } from 'react';

import { IcCameraSmall } from '../../../assets';
import { BG_COLOR_CHART } from '../../constants/colorChart';
import useGetPresignedUrl from '../../hooks/useGetPresignedUrl';
import { ShowColorChartProps } from '../../type/lecueNoteType';
import * as S from './ShowColorChart.style';

function ShowColorChart({
  isIconClicked,
  colorChart,
  state,
  handleTransformImgFile,
  presignedUrlDispatch,
  selectedFile,
  handleFn,
  handleIconFn,
}: ShowColorChartProps) {
  const imgRef = useRef<HTMLInputElement | null>(null);
  useGetPresignedUrl({ presignedUrlDispatch });

  const handleImageUpload = () => {
    const fileInput = imgRef.current;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // reader1: 파일을 base64로 읽어서 업로드
      const reader1 = new FileReader();
      reader1.readAsDataURL(file);
      reader1.onloadend = () => {
        if (reader1.result !== null) {
          handleTransformImgFile(reader1.result as string);
        }
      };

      // reader2: 파일을 ArrayBuffer로 읽어서 PUT 요청 수행
      const reader2 = new FileReader();
      reader2.readAsArrayBuffer(file);
      // reader1의 비동기 작업이 완료된 후 수행(onloadend() 활용)
      reader2.onloadend = () => {
        handleTransformImgFile(reader2);
        selectedFile(file);
      };
    }
  };

  return (
    <S.Wrapper>
      {colorChart === BG_COLOR_CHART && (
        <>
          <S.Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={imgRef}
          />

          <S.IconWrapper
            onClick={() => {
              handleIconFn();
              imgRef.current?.click();
            }}
            $isIconClicked={isIconClicked}
          >
            <IcCameraSmall />
          </S.IconWrapper>
        </>
      )}
      {colorChart.map((colorCode) => (
        <S.ColorWrapper key={colorCode}>
          <S.Color
            type="button"
            id={colorCode}
            name={colorChart === BG_COLOR_CHART ? 'background' : 'textColor'}
            variant={state === colorCode}
            $isIconClicked={
              colorChart === BG_COLOR_CHART ? isIconClicked : false
            }
            $colorCode={colorCode}
            onClick={handleFn}
          ></S.Color>
        </S.ColorWrapper>
      ))}
    </S.Wrapper>
  );
}

export default ShowColorChart;
