import Team from "../models/Team.js";

export const createTeam = async (req, res) => {
  try {
    const { teamName, employees, project, teamLead } = req.body;

    let managerId = null;
    let teamLeadId = null;

    // MANAGER creating team
    if (req.user.role === "MANAGER") {
      managerId = req.user._id;
      teamLeadId = teamLead;
    }

    // TEAMLEAD creating own team
    if (req.user.role === "TEAMLEAD") {
      teamLeadId = req.user._id;
    }

    const existingTeam = await Team.findOne({
      teamLead: teamLeadId,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team already exists for this TeamLead",
      });
    }

    const team = await Team.create({
      teamName,
      manager: managerId,
      teamLead: teamLeadId,
      employees,
      project,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkTeamLead = async (req, res) => {
  try {
    const team = await Team.findOne({
      teamLead: req.user._id,
    });

    res.json({
      isTeamLead: !!team,
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Get Team members
export const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      teamLead: req.user._id,
    })
      .populate({
        path: "employees",
        select: "name email role designation",
        populate: {
          path: "designation",
          select: "title",
        },
      })
      .populate("teamLead", "name email");

    if (!team) {
      return res.status(404).json({
        message: "No Team Found",
      });
    }

    res.json({
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/// Update Team members
export const updateTeamMembers = async (req, res) => {
  try {
    const { employees,teamName } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // only owner can edit
    if (
      String(team.teamLead) !== String(req.user._id) &&
      String(team.manager) !== String(req.user._id)
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    team.employees = employees;
    team.teamName = teamName;

    await team.save();

    res.json({
      success: true,
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
