import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project, PullRequest } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { BaseInput, Button } from "@/components/theme";
import BranchComboBox from "../branches/BranchComboBox";
import { BranchPopover } from "../branches/BranchPopover";
import { BranchWithNameAndId } from "../branches/CreateBranchModal";
import BaseModal from "../theme/BaseModal";
import { showToast } from "../theme/showToast";

interface PullRequestType {
  title: string;
}

interface BranchModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccessCreation: (pullRequest: PullRequest & { project: Project }) => void;
}

const CreatePullRequestModal = ({
  isOpen,
  setIsOpen,
  onSuccessCreation,
}: BranchModalProps) => {
  const defaultBranches: BranchWithNameAndId[] = [
    { id: "1", name: "main" },
    { id: "2", name: "staging" },
    { id: "3", name: "production" },
  ];
  const [baseBranchFrom, setBaseBranchFrom] = useState(defaultBranches[0]);
  const [currentBranch, setCurrentBranch] = useState(defaultBranches[1]);
  const [branches, setBranches] = useState(defaultBranches);

  const router = useRouter();

  const schema = z.object({
    title: z.string(),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const pullRequestMutation = trpc.pullRequest.create.useMutation({
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Pull Request successfully created",
        subtitle: `Pull Request created`,
      });
      setIsOpen(false);
      reset();

      onSuccessCreation(data);
    },
  });

  const createNewBranch: SubmitHandler<PullRequestType> = async (data) => {
    const { title } = data;

    if (!title) {
      return;
    }

    const projectSlug = router.query.slug as string;

    pullRequestMutation.mutate({ pullRequest: { title, projectSlug } });
  };

  return (
    <BaseModal title="New Pull Request" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(createNewBranch)}>
        <div className="my-6">
          <label className="relative inline-block text-sm">Title</label>

          <BaseInput
            {...register("title")}
            className="my-2 px-3 py-2"
            name="title"
            required
            full
          />
        </div>

        <div className="mb-4 w-full">
          <BranchComboBox
            branches={branches}
            selectedBranch={currentBranch}
            setSelectedBranch={setCurrentBranch}
            inputPadding="lg"
            inputLabel="Current Branch"
          />
        </div>

        <div className="mb-4 w-full">
          <BranchComboBox
            branches={branches}
            selectedBranch={baseBranchFrom}
            setSelectedBranch={setBaseBranchFrom}
            inputLabel="Base Branch"
          />
        </div>

        <div className="float-right">
          <Button type="submit">Create Pull Request</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreatePullRequestModal;
