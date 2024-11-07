import { create } from "zustand";
import { devtools, createJSONStorage, persist } from "zustand/middleware";

type MembersType = {
  memberId: string;
  path: string;
};

type PresenceState = {
  membersId: MembersType[];
  add: (member: MembersType) => void;
  remove: (member: MembersType) => void;
  initialize: (members: MembersType[]) => void;
  updatePath: (id: string, newPath: string) => void;
};

const usePresenceStore = create<PresenceState>()(
  devtools(
    persist(
      (set) => ({
        membersId: [],
        updatePath: (id, newPath) =>
          set((state) => ({
            membersId: state.membersId.map((member) =>
              member.memberId === id ? { memberId: id, path: newPath } : member
            ),
          })),
        add: (member) =>
          set((state) => {
            if (
              !state.membersId.find(
                ({ memberId }) => memberId === member.memberId
              )
            ) {
              return { membersId: [...state.membersId, member] };
            }
            return state;
          }),
        remove: (member) =>
          set((state) => ({
            membersId: state.membersId.filter(
              ({ memberId }) => memberId !== member.memberId
            ),
          })),
        initialize: (members) =>
          set((state) => {
            if (JSON.stringify(state.membersId) !== JSON.stringify(members)) {
              return { membersId: members };
            }
            return state;
          }),
      }),
      {
        name: "ProperlyPresence",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default usePresenceStore;
