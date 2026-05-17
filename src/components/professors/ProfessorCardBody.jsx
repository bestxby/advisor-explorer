import ProfessorDirectionDetail from './ProfessorDirectionDetail';
import ProfessorEvaluation from './ProfessorEvaluation';
import ProfessorMeta from './ProfessorMeta';
import ProfessorPapers from './ProfessorPapers';
import ProfessorResources from './ProfessorResources';
import ProfessorStarterProject from './ProfessorStarterProject';
import ProfessorTechStack from './ProfessorTechStack';

export default function ProfessorCardBody({ professor }) {
  return (
    <div className="px-6 pb-6 border-t border-[#2a3550] pt-6 space-y-8">
      <ProfessorDirectionDetail detail={professor.directionDetail} />
      <ProfessorPapers papers={professor.papers} />
      <ProfessorEvaluation
        evaluation={professor.evaluation}
        suitableFor={professor.suitableFor}
      />
      <ProfessorTechStack
        techStack={professor.techStack}
        conferences={professor.conferences}
      />
      <ProfessorResources resources={professor.resources} />
      <ProfessorStarterProject project={professor.starterProject} />
      <ProfessorMeta style={professor.style} contact={professor.contact} />
    </div>
  );
}
