import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-direction: column;
`;

export const LecueNote = styled.article<{ $bgColor: string }>`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: calc(100dvh - 33.2rem);

  border-radius: 0.6rem;
  background-color: ${({ $bgColor }) => $bgColor};
`;

export const Nickname = styled.p`
  margin: 2rem 0 1rem 2rem;

  ${({ theme }) => theme.fonts.Head1_B_20}
`;

export const Contents = styled.textarea<{ $textColor: string }>`
  width: calc(100% - 4rem);
  height: 100%;
  margin: 0 2rem 2rem;

  border: none;
  ${({ theme }) => theme.fonts.Body1_R_16};
  background-color: transparent;
  color: ${({ $textColor }) => $textColor};
`;

export const BottomContentsWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  width: calc(100% - 4rem);
  height: 1.7rem;
  margin: 0 2rem 2rem;
`;

export const Date = styled.p`
  ${({ theme }) => theme.fonts.E_Body2_R_14};
  color: ${({ theme }) => theme.colors.DG50};
`;

export const Counter = styled.p`
  ${({ theme }) => theme.fonts.E_Body2_R_14};
  color: ${({ theme }) => theme.colors.DG};
`;

export const Notice = styled.p`
  color: ${({ theme }) => theme.colors.key};

  ${({ theme }) => theme.fonts.Caption1_R_12};
`;
